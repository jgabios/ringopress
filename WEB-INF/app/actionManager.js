
/**
 * @fileOverview an easy function that loads action files and exports them as an object
 * that can be used in an actions exports statement.
 * @param action of @type Array - specifies what actions to load
 * @param folder of @type String - from what folder to load the actions
 * @return an object with keys as actionName / url mapping and as value having a function that will handle the request
 * 
 * if action is an empty array, or undefined, then all actions in the folder specified are taken into account
 */

exports.getActions = function(actions,folder){
    var rez = {};
    if(!actions || actions.length < 1){
        actions = [];
        var fs = require('fs-base');
        var strings = require('ringo/utils/strings');
        var actionFolderFiles = fs.list(fs.workingDirectory()+'/WEB-INF/app/'+folder);
        for(var i=0,l=actionFolderFiles.length;i<l;i++){
            if(strings.endsWith(actionFolderFiles[i],'.js')){
                var actionName = actionModules[i].replace('.js','').toLowerCase();
                actions.push(actionName);
            }
        }
    }
    for(var i=0,l=actions.length;i<l;i++){
        rez[actions[i]] = require(folder+actions[i]).action;
    }
    return rez;
}
