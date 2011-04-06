var fs = require('fs');
var stringUtils = require('ringo/utils/strings');
var bizplugin = require('biz/plugin.js').admin;
var model = require('model');

var hookPluginsMap = {};

var plugins = (function(){
    var i=0,l=0,plugins = {};
    var gdsPlugins = bizplugin.getPlugins();
    for(i=0,l=gdsPlugins.length;i<l;i++){
            var pluginName = gdsPlugins[i]['name'].toLowerCase();
            var obj = require(pluginName+'.gae');
            plugins[pluginName]=obj['plugin'];
            var hook = gdsPlugins[i]['hook'];
            if(hook){
                if(!hookPluginsMap[hook]){
                    hookPluginsMap[hook]=[];
                }
                hookPluginsMap[hook].push(obj['plugin']);
            }
    }
    var pluginFolderFiles = fs.list(fs.workingDirectory()+'/WEB-INF/app/plugins');
    for(i=0,l=pluginFolderFiles.length;i<l;i++){
        if(stringUtils.endsWith(pluginFolderFiles[i],'plugin.js')){
            var pluginName = pluginFolderFiles[i].replace('plugin.js','').toLowerCase();
            var obj = require('plugins/'+pluginFolderFiles[i]);
            plugins[pluginName]=obj['plugin'];
            if(obj['plugin'].hook){
                if(!hookPluginsMap[obj['plugin'].hook]){
                    hookPluginsMap[obj['plugin'].hook]=[];
                }
                hookPluginsMap[obj['plugin'].hook].push(obj['plugin']);
            }
            var plugin = new model.Plugin({'keyName': pluginName});
            plugin['lastModified'] = new Date();
            plugin['name'] = pluginName;
            plugin['email'] = obj['plugin'].email;
            plugin['author'] = obj['plugin'].author;
            plugin['version'] = obj['plugin'].version;
            plugin['type'] = 'FILE';
            plugin['activated'] = true;
            bizplugin.savePlugin(plugin);
        }
    }
    return plugins;
})();

var executeBeforePluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.activated && plugin.workBefore && (plugin.workBefore instanceof Function)){
                plugin.workBefore(args);
            }
        }
    }
}

var executeAfterPluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.activated && plugin.workAfter && (plugin.workAfter instanceof Function)){
                plugin.workAfter(args);
            }
        }
    }
}

exports.manager = {
    plugins: plugins,
    getPlugin: function(name){
        return plugins[name];
    },
    executeBeforePluginsForHook: executeBeforePluginsForHook,
    executeAfterPluginsForHook: executeAfterPluginsForHook
}