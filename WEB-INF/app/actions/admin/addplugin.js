
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
              var pluginZipResource = require("google/appengine/api/urlfetch").fetch(url);
              var io=require('io');
              var stream = new java.io.ByteArrayInputStream(pluginZipResource.content.toByteArray());
              var entryGenerator = require('ringo/zip').ZipIterator(stream);
              var plugin;
              while(true){
                try{
                var pluginJSONObj='';
                var entry = entryGenerator.next();
                var pluginStream = new io.TextStream(entry);
                var line = null;
                while(line !== ''){
                 line = pluginStream.readLine();
                 pluginJSONObj+=line;
                }
                if(entry['name']=='metainf.json') {
                  pluginJSONObj = JSON.parse(pluginJSONObj);
                  plugin = new model.Plugin({'keyName': pluginJSONObj['name']});
                  plugin['lastModified'] = new Date();
                  plugin['name'] = pluginJSONObj['name'];
                  plugin['email'] = pluginJSONObj['email'];
                  plugin['author'] = pluginJSONObj['author'];
                  plugin['version'] = pluginJSONObj['version'];
                  plugin['type'] = 'GDS';
                  plugin['activated'] = false;
                }
                if(entry['name']=='plugin.js') {
                  plugin['code'] = pluginJSONObj;
                }
                } catch(e) {
                  print('catch '+e);
                  break;
                }
              }
              var validationCode = bizplugin.savePlugin(plugin);
              if(validationCode){
                  return {
                      status: 'redirect',
                      url: '/admin/plugins'
                  };
              }
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