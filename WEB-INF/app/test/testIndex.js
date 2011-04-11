var assert = require("assert");
var middleware = require("ringo/middleware/static").middleware;

exports.testIndexPage = function(){
 var app = middleware({base: './'})();
 var resp = app({pathInfo: '/'});
 for(var k in resp)
 print(k+' - '+resp[k]);
}

if (require.main == module.id) {
 system.exit(require("test").run(exports));
}

