var CONSTANTS = require('constants');
var pluginManager = require('pluginManager.js');

exports.action = require('action').action({
    "skin": "admin/plugins.html",
    "getContext": function(env){
        if(env.req.params['id']){
            // ativate / deactivate
        }

        return {
            plugins: plugins
        };
    }
});
