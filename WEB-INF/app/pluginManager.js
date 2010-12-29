var fs = require('fs');
var stringUtils = require('ringo/utils/strings');

var hookPluginsMap = {};

var plugins = (function(){
    var i=0,l=0,plugins = {},
    pluginFolderFiles = fs.list(fs.workingDirectory()+'/WEB-INF/app/plugins');
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
        }
    }
    return plugins;
})();

var executeBeforePluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.workBefore && (plugin.workBefore instanceof Function)){
                plugin.workBefore(args);
            }
        }
    }
}

var executeAfterPluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.workAfter && (plugin.workAfter instanceof Function)){
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