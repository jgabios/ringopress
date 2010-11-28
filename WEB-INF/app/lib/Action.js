var MT = require('mootools-core-1.3-server.js');
var {Response} = require('ringo/webapp/response');

var Action = new MT.Class({
    initialize: function(){
        this.skin = 'skins/index.html';
    },
    process: function(req,url){
        var response = Response.skin(this.skin, this.getContext(req,url));
        return this.processResponse(response);
    },
    getContext: function(req,url){
        return {};
    },
    processResponse: function(response){

    }
});
exports.action = Action;