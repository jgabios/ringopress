/**
 * @fileOverview Low level JSGI adapter implementation.
 */

var {Headers, getMimeParameter} = require('ringo/webapp/util');
var {Stream} = require('io');
var {Binary, ByteString} = require('binary');
var system = require('system')

export('handleRequest', 'writeHeaders');
var log = require('ringo/logging').getLogger(module.id);

/**
 * Handle a JSGI request.
 * @param moduleId the module id. Ignored if functionObj is already a function.
 * @param functionObj the function, either as function object or function name to be
 *             imported from the module moduleId.
 * @param req the JSGI request object
 * @returns the JSGI response object
 */
function handleRequest(moduleId, functionObj, request) {
    initRequest(request);
    var app;
    if (typeof(functionObj) == 'function') {
        app = functionObj;
    } else {
        var module = require(moduleId);
        app = module[functionObj];
        var middleware = module.middleware || [];
        request.env.ringo_config = moduleId;
        app = middleware.reduceRight(middlewareWrapper, resolve(app));
    }
    if (!(typeof(app) == 'function')) {
        throw new Error('No valid JSGI app: ' + app);
    }
    var result = app(request);
    if (!result) {
        throw new Error('No valid JSGI response: ' + result);
    }
    commitResponse(request, result);
}

/**
 * Set up the I/O related properties of a jsgi environment object.
 * @param env a jsgi request object
 */
function initRequest(request) {
    var input, errors;
    if (request.hasOwnProperty('input')) {
        // already set up, probably because the original request threw a retry
        return;
    }
    Object.defineProperty(request, "input", {
        get: function() {
            if (!input)
                input = new Stream(request.env.servletRequest.getInputStream());
            return input;
        }
    });
    Object.defineProperty(request.jsgi, "errors", {
        value: system.stderr
    });
}

/**
 * Apply the return value of a JSGI application to a servlet response.
 * This is used internally by the org.ringojs.jsgi.JsgiServlet class, so
 * you won't need this unless you're implementing your own servlet
 * based JSGI connector.
 *
 * @param req the JSGI request argument
 * @param result the object returned by a JSGI application
 */
function commitResponse(req, result) {
    var request = req.env.servletRequest;
    var response = req.env.servletResponse;
    var {status, headers, body} = result;
    if (!status || !headers || !body) {
        // Check if this is an asynchronous response. If not throw an Error
        if (handleAsyncResponse(request, response, result)) {
            return;
        } else {
            throw new Error('No valid JSGI response: ' + result);
        }
    }
    // Allow application/middleware to handle request via Servlet API
    if (!response.isCommitted() && !Headers(headers).contains("X-JSGI-Skip-Response")) {
        writeResponse(response, status, headers, body);
    }
}

function writeResponse(servletResponse, status, headers, body) {
    servletResponse.setStatus(status);
    writeHeaders(servletResponse, headers);
    var charset = getMimeParameter(headers.get("Content-Type"), "charset");
    writeBody(servletResponse, body, charset);
}

function writeHeaders(servletResponse, headers) {
    for (var key in headers) {
        var values = headers[key];
        if (typeof values === "string") {
            values = values.split("\n");
        } else if (!Array.isArray(values)) {
            continue;
        }
        values.forEach(function(value) {
            servletResponse.addHeader(key, value);
        });
    }
}

function writeBody(response, body, charset) {
    if (body && typeof body.forEach == "function") {
        var output = response.getOutputStream();
        var writer = function(part) {
            if (!(part instanceof Binary)) {
                part = part.toByteString(charset);
            }
            output.write(part);
        };
        body.forEach(writer);
        if (typeof body.close == "function") {
            body.close(writer);
        }
    } else {
        throw new Error("Response body doesn't implement forEach: " + body);
    }
}

function writeAsync(servletResponse, jsgiResponse) {
    if (!jsgiResponse.status || !jsgiResponse.headers || !jsgiResponse.body) {
        throw new Error('No valid JSGI response: ' + jsgiResponse);
    }
    var {status, headers, body} = jsgiResponse;
    writeResponse(servletResponse, status, Headers(headers), body);
}

function handleAsyncResponse(request, response, result) {
    // support for asynchronous JSGI based on Jetty continuations
    // If result has a "suspend" method we just call it and return, letting
    // the response take care of everything
    if (typeof result.suspend === "function") {
        result.suspend();
        return true;
    }
    // As a convenient shorthand, allow apps to return the deferred as returned
    // by ringo.promise.defer()
    if (result.promise && typeof result.promise.then === "function") {
        result = result.promise;
    }
    // Only handle asynchronously if the result has a then() function
    if (typeof result.then !== "function") {
        return false;
    }

    var {ContinuationSupport, ContinuationListener} = org.eclipse.jetty.continuation;
    var continuation = ContinuationSupport.getContinuation(request);
    var handled = false;

    var onFinish = sync(function(value) {
        if (handled) return;
        log.debug("JSGI async response finished", value);
        handled = true;
        writeAsync(continuation.getServletResponse(), value);
        continuation.complete();
    }, request);

    var onError = sync(function(error) {
        if (handled) return;
        log.error("JSGI async error", error);
        var jsgiResponse = {
            status: 500,
            headers: {"Content-Type": "text/html"},
            body: ["<!DOCTYPE html><html><body><h1>Error</h1><p>", String(error), "</p></body></html>"]
        };
        handled = true;
        writeAsync(continuation.getServletResponse(), jsgiResponse);
        continuation.complete();
    }, request);

    continuation.addContinuationListener(new ContinuationListener({
        onTimeout: sync(function() {
            if (handled) return;
            log.error("JSGI async timeout");
            var jsgiResponse = {
                status: 500,
                headers: {"Content-Type": "text/html"},
                body: ["<!DOCTYPE html><html><body><h1>Error</h1><p>Request timed out</p></body></html>"]
            };
            handled = true;
            writeAsync(continuation.getServletResponse(), jsgiResponse);
            continuation.complete();
        }, request)
    }));

    log.debug('handling JSGI async response, calling then');
    sync(function() {
        result.then(onFinish, onError);
        // default async request timeout is 30 seconds
        continuation.setTimeout(result.timeout || 30000);
        continuation.suspend(response);
    }, request)();
    return true;
}

/**
 * Convenience function that resolves a module id or object to a
 * JSGI middleware or application function. This assumes the function is
 * exported as "middleware" or "handleRequest".
 * @param module a function, module object, or moudule id
 */
function resolve(module) {
    if (typeof module == 'string') {
        module = require(module);
        return module.middleware || module.handleRequest;
    }
    return module;
}

/**
 * Helper function for wrapping middleware stacks
 * @param inner an app or middleware module or function wrapped by outer
 * @param outer a middleware module or function wrapping inner
 */
function middlewareWrapper(inner, outer) {
    return resolve(outer)(inner);
}
