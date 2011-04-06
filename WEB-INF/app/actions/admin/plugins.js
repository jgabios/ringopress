var CONSTANTS = require('constants');
var bizplugin = require('biz/plugin.js').admin;

exports.action = require('action').action({
    "skin": "admin/plugins.html",
    "getContext": function(env){
        if(env.req.params['id'] && env.req.params['action']){
            var action = env.req.params['action'];
            if(action.indexOf('activate')!=-1) {
              var plugin = bizplugin.getPluginById(env.req.params['id']);
              plugin['activated'] = action=='activate';
              bizplugin.savePlugin(plugin);
            }
            if(action.indexOf('delete')!=-1) {
              var plugin = bizplugin.getPluginById(env.req.params['id']);
              plugin.remove();
            }
        }
        var plugins = bizplugin.getPlugins();
        return {
            plugins: plugins
        };
    }
});
