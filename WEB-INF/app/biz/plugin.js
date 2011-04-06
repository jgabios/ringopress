var model = require('model');

var savePlugin = function(plugin){
    // some checks for code not empty, author's email, etc ...
    plugin.put();
    return true;
}

var getPlugins = function(){
    return model.Plugin.all().fetch();
}

var getPluginById = function(id){
  return model.Plugin.get(id);
}

var getPluginByName = function(name) {
  return model.Plugin.all().filter('name=',name).fetch(1);
}

exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);
