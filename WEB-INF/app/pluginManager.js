/**
 * @fileOverview pluginManager contains functions and methods to handle the plugins.
 * we have 2 types of plugins: render plugins, executed when a certain page is requested,
 * and it usually modifies the DOM of the page that goes to the user. This type of plugins
 * must implement a render function that gets called before the page goes to the client.
 * The other type of plugin hooks into a biz layer method [createNewPost, getCommentsCount()]
 * and implements 2 methods: a beforeMethodCall and afterMethodCall.these 2 methods are called by
 * the pluginManager as their name says, before and after the biz method is called.
 *
 */

var fs = require('fs');
var stringUtils = require('ringo/utils/strings');
var bizplugin = require('biz/plugin.js').admin;
var model = require('model');
var CONSTANTS = require('constants');

var plugins = {}, hookPluginsMap = {};
var pluginDefaultSuffix = 'plugin.js';

exports.initPlugins = function() {
  var pluginFolderFiles = fs.list(fs.workingDirectory()+'/WEB-INF/app/plugins');
  for(var i=0,l=pluginFolderFiles.length;i<l;i++){
      if(stringUtils.endsWith(pluginFolderFiles[i],pluginDefaultSuffix)){
        var pluginName = pluginFolderFiles[i].replace(pluginDefaultSuffix,'').toLowerCase();
        var obj = require(CONSTANTS.PLUGIN_DEFAULT_FOLDER+pluginFolderFiles[i]);
        var plugin = bizplugin.getPluginByName(pluginName);
        if(plugin==null){
          plugin = new model.Plugin({'keyName': pluginName});
          plugin['lastModified'] = new Date();
          plugin['name'] = pluginName;
          plugin['email'] = obj.email;
          plugin['author'] = obj.author;
          plugin['hook'] = obj.hook;
          plugin['version'] = obj.version;
          plugin['type'] = 'FILE';
          plugin['activated'] = obj.activatedByDefault;
          bizplugin.savePlugin(plugin);
        }
      }
  }
  reloadCache();
}

var addPlugin = exports.addPlugin = function(plugin){
  var obj, pluginName = plugin['name'].toLowerCase();
  var type = plugin['type'];
  if(type == 'GDS'){
    obj = require(pluginName+'.gae');
  } else {
    obj = require(CONSTANTS.PLUGIN_DEFAULT_FOLDER+pluginName+pluginDefaultSuffix);
  }
  plugins[pluginName]=obj['plugin'];
  plugins[pluginName].activated = plugin['activated'];
  var hook = plugin['hook'];
  if(hook){
      if(!hookPluginsMap[hook]){
          hookPluginsMap[hook]=[];
      }
      hookPluginsMap[hook].push(obj['plugin']);
  }
}

var reloadCache = exports.reloadCache = function(){
    var plugins = bizplugin.getPlugins();
    for(var i=0,l=plugins.length;i<l;i++){
      addPlugin(plugins[i]);
    }
}

exports.executeBeforePluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.activated && plugin.workBefore && (plugin.workBefore instanceof Function)){
                plugin.workBefore(args);
            }
        }
    }
}

exports.executeAfterPluginsForHook = function(hook,args){
    if(hookPluginsMap[hook] && hookPluginsMap[hook].length>0){
        for(var i=0;i<hookPluginsMap[hook].length;i++){
            var plugin = hookPluginsMap[hook][i];
            if(plugin.activated && plugin.workAfter && (plugin.workAfter instanceof Function)){
                plugin.workAfter(args);
            }
        }
    }
}

exports.getPlugin = function(name){
      return plugins[name];
  }

export('plugins');
