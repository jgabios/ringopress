
/**
 * @fileOverview this module provides bizexport function
 * that wraps a biz layer function into 2 additional calls
 * a before and an after function that will get executed when
 * the biz function runs
 */

var pluginManager = require('pluginManager').manager;

exports.bizexport = function(module){
    return function(env){
    var rez = {};
    for(var item in module){
        if((module[item] instanceof Function) && module.hasOwnProperty(item)){
            rez[item]=(function(func,funcName,env){
                return function(){
                    var args = {arguments: arguments,env: env};
                    pluginManager.executeBeforePluginsForHook(funcName,args);
                    var result = func.apply(module,arguments); // we can add result to afterwork arguments to filter it as an example
                    pluginManager.executeAfterPluginsForHook(funcName,args);
                    return result;
                };
            })(module[item],item,env);
        }
    }
    return rez;
    }
};
