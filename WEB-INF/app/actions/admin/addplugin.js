
/**
 * @fileOverview add plugin action
 */

var bizplugin = require('biz/plugin.js').admin;
var model = require('model');

exports.action = require('action').action({
    "skin": "admin/addplugin.html",
    "getContext": function(env){
        if(env.req.isGet){
            return {};
        }
        if(env.req.isPost){
            if(env.req.params['submitimport'] && env.req.params['submitimport']=='Import') {
              var url = env.req.params['pluginzipurl'];
            }
            else if(env.req.params['Save'] && env.req.params['submitimport']=='save') {
              var plugin = new model.Plugin({'keyName': env.req.params['name']});
              plugin['lastModified'] = new Date();
              plugin['code'] = env.req.params['code'];
              plugin['name'] = env.req.params['name'];
              plugin['email'] = env.req.params['email'];
              plugin['author'] = env.req.params['author'];
              plugin['version'] = env.req.params['version'];
              plugin['type'] = 'GDS';
              plugin['activated'] = false;
              var validationCode = bizplugin.savePlugin(plugin);
              if(validationCode){
                  return {
                      status: 'redirect',
                      url: '/admin/plugins'
                  };
              } else {
                  return {plugin: plugin};
              }
            }
        }
    }
});