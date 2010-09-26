/*
 * The webapp module provides support for building web applications in RingoJS.
 */

// import modules
require('core/object');
require('core/string');

include('ringo/webapp/request');
include('ringo/webapp/response');

var fileutils = require('ringo/fileutils');
var daemon = require('ringo/webapp/daemon');

export('getConfig',
       'handleRequest',
       'main');

var log = require('ringo/logging').getLogger(module.id);

/**
 * Handler function called by the JSGI servlet.
 *
 * @param req the JSGI 0.3 request object
 */
function handleRequest(req) {
    // get config and apply it to req, res
    var configId = req.env.ringo_config || 'config';
    var config = getConfig(configId);
    if (log.isDebugEnabled()){
        log.debug('got config: ' + config.toSource());
    }

    // set req in webapp env module
    var webenv = require('ringo/webapp/env');
    req = Request(req);
    var res = null;
    webenv.setRequest(req);

    req.charset = config.charset || 'utf8';

    // URI-decode path-info
    req.pathInfo = decodeURI(req.pathInfo);

    try {
        return resolveInConfig(req, webenv, config, configId);
    } catch (e if e.redirect) {
        return redirectResponse(e.redirect);
    } finally {
        webenv.reset();
    }
}

function resolveInConfig(req, webenv, config, configId) {
    log.debug('resolving path {}', req.pathInfo);
    // set rootPath to the root context path on which this app is mounted
    // in the request object and config module, appPath to the path within the app.
    req.rootPath = config.rootPath = req.scriptName + '/';
    req.appPath = config.appPath = req.path.substring(req.rootPath.length);
    // set config property in webapp env module
    webenv.pushConfig(config, configId);

    if (!Array.isArray(config.urls)) {
        log.info("No URL mapping defined (urls is " + config.urls + "), throwing 404.");
        throw {notfound: true};
    }

    var path = req.pathInfo.replace(/^\/+|\/+$/g, "");

    for each (var urlEntry in config.urls) {
        if (!Array.isArray(urlEntry) || urlEntry.length < 2) {
            log.info("Ignoring unsupported URL mapping: " + urlEntry);
            continue;
        }
        log.debug("checking url line: {}", urlEntry);
        var match = getPattern(urlEntry).exec(path);
        log.debug("got match: {}", match);

        if (match) {
            var moduleId = resolveId(configId, urlEntry);
            var module = getModule(moduleId);
            log.debug("Resolved module: {} -> {}", moduleId, module);
            // move matching path fragment from PATH_INFO to SCRIPT_NAME
            appendToScriptName(req, match[0]);
            // prepare action arguments, adding regexp capture groups if any
            var args = [req].concat(match.slice(1));
            // lookup action in module
            var action = getAction(req, module, urlEntry, args);
            // log.debug("got action: " + action);
            if (typeof action == "function") {
                var res = action.apply(module, args);
                if (res && typeof res.close === 'function') {
                    return res.close();
                }
                return res;
            } else if (Array.isArray(module.urls)) {
                return resolveInConfig(req, webenv, module, moduleId);
            }
        }
    }
    throw { notfound: true };
}

function getPattern(spec) {
    var pattern = spec[0];
    if (typeof pattern == "string") {
        if (pattern.startsWith("/"))
            pattern = pattern.replace("/", "^");
        pattern = spec[0] = new RegExp(pattern);
    } else if (!(pattern instanceof RegExp)) {
        throw Error("Pattern must be a regular expression or string");
    }
    return pattern;
}

function resolveId(parent, spec) {
    var moduleId = spec[1];
    if (typeof moduleId == "string") {
        return fileutils.resolveId(parent, moduleId);
    } else {
        return moduleId;
    }
}

function getModule(moduleId) {
    if (typeof moduleId == "string") {
        return require(moduleId);
    } else if (!(moduleId instanceof Object)) {
        throw Error("Module must be a string or object");
    }
    return moduleId;
}

function getAction(req, module, urlconf, args) {
    var path = splitPath(req.pathInfo);
    var action;
    // if url-conf has a hard-coded action name use it
    var name = urlconf[2];
    if (typeof module === "function") {
        action = module;
    } else {
        if (!name) {
            // action name is not defined in url mapping, try to get it from the request path
            name = path[0];
            if (name) {
                action = module[name.replace(/\./g, "_")];
                if (typeof action == "function") {
                    // If the request path contains additional elements check whether the
                    // candidate function has formal arguments to take them
                    if (path.length <= 1 || args.length + path.length - 1 <= action.length) {
                        appendToScriptName(req, name);
                        Array.prototype.push.apply(args, path.slice(1));
                        return action;
                    }
                }
            }
            // no matching action, fall back to "index"
            name = "index";
        }
        action = module[name];
    }
    if (typeof action == "function") {
        // insert predefined arguments if defined in url-conf
        if (urlconf.length > 3) {
            var spliceArgs = [1, 0].concat(urlconf.slice(3));
            Array.prototype.splice.apply(args, spliceArgs);
        }
        if (path.length == 0 || args.length + path.length <= action.length) {
            if (path.length == 0 && args.slice(1).join('').length == 0) {
                checkTrailingSlash(req);
            }
            Array.prototype.push.apply(args, path);
            return action;
        }
    }
    return null;
}

function checkTrailingSlash(req) {
    // only redirect for GET requests
    if (!req.path.endsWith("/") && req.isGet) {
        var path = req.queryString ?
                req.path + "/?" + req.queryString : req.path + "/";
        throw {redirect: path};
    }
}

function appendToScriptName(req, fragment) {
    var path = req.pathInfo;
    var pos = path.indexOf(fragment);
    if (pos > -1) {
        pos += fragment.length;
        // add matching pattern to script-name
        req.scriptName += path.substring(0, pos);
        // ... and remove it from path-info
        req.pathInfo = path.substring(pos);
    }
}

function splitPath(path) {
    //remove leading and trailing slashes and split
    var array = path.replace(/^\/+|\/+$/g, "").split(/\/+/);
    return array.length == 1 && array[0] == "" ? [] : array;
}

/**
 * Try to load the configuration module.
 * @param configModuleName optional module name, default is 'config'
 */
function getConfig(configModuleName) {
    configModuleName = configModuleName || 'config';
    return require(configModuleName);
}

/**
 * Main webapp startup function.
 * @param {String} path optional path to the web application directory or config module.
 */
function main(path) {
    // parse command line options
    var cmd = system.args.shift();
    try {
        var options = daemon.parseOptions(system.args, {
            app: "app",
            config: "config"
        });
    } catch (error) {
        print(error);
        require("ringo/shell").quit();
    }

    if (options.help) {
        print("Usage:");
        print("", cmd, "[OPTIONS]", "[PATH]");
        print("Options:");
        print(parser.help());
        require("ringo/shell").quit();
    }

    // if no explicit path is given use first command line argument
    path = path || system.args[0];
    var fs = require("fs");
    if (path && fs.exists(path)) {
        if (fs.isFile(path)) {
            // if argument is a file use it as config module
            options.config = fs.base(path);
            path = fs.directory(path);
        }
    } else {
        path = ".";
    }
    // prepend the web app's directory to the module search path
    require.paths.unshift(path);

    // logging module is already loaded and configured, check if webapp provides
    // its own log4j configuration file and apply it if so.
    if (fs.isFile(fs.join(path, "config", "log4j.properties"))) {
        require("./logging").setConfig(getResource('config/log4j.properties'));
    }

    daemon.init();
    daemon.start();
}

if (require.main == module) {
    main();
}
