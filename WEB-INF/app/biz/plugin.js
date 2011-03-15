var model = require('model');

var savePlugin = function(plugin){
    // some checks for code not empty, author's email, etc ...
    plugin.put();
    return true;
}

var getPlugins = function(){
    return model.Plugin.all().fetch();
}

exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);