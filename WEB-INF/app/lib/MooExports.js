var MT = require('mootools-core-1.3-server.js');
var fs = require('fs');
var strings = require('ringo/utils/strings');

var MooExports = new MT.Class({
    initialize: function(actionFolder){
        this.exports = {};
        this.folderSuffix = actionFolder;
    },
    getExports: function(){
        var i=0,
        l=0,
        actionModules = [],
        actionFolderFiles = fs.list(fs.workingDirectory()+'/WEB-INF/app/'+this.folderSuffix);
        for(i=0,l=actionFolderFiles.length;i<l;i++){
            if(strings.endsWith(actionFolderFiles[i],'Action.js')){
                actionModules.push(actionFolderFiles[i]);
            }
        }
        for(i=0,l=actionModules.length;i<l;i++){
            var actionName = actionModules[i].replace('Action.js','').toLowerCase();
            this.exports[actionName]=require(this.folderSuffix+'/'+actionModules[i])[actionName];
        }
        return this.exports;
    }
});

exports.mooexports = MooExports;