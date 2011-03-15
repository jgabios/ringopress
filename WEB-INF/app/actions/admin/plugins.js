var CONSTANTS = require('constants');
var pluginManager = require('pluginManager.js');
var bizplugin = require('biz/plugin.js').admin;

exports.action = require('action').action({
    "skin": "admin/plugins.html",
    "getContext": function(env){
        if(env.req.params['id']){
            // ativate / deactivate
        }
        var plugins = bizplugin.getPlugins();
        for(var i=0;i< plugins.length ;i++){
            for(var t in plugins[i]){
                print(t+' ----- '+plugins[i][t]);
            }
        }
        return {
            plugins: plugins
        };
    }
});
