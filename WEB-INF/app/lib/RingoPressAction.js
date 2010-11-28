var action = require('lib/Action');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var ObjectUtil = require('ringo/utils/objects');

var RingoPressAction = new MT.Class({
    Extends: action.action,
    initialize: function(){
        this.parent();
        this.defaultContext = {
            page: {
                title: CONSTANTS.BLOG_TITLE
            },
            blog: {
                name: CONSTANTS.BLOG_NAME,
                description: CONSTANTS.BLOG_DESCRIPTION
            }
        };
    },
    getContext: function(req,url){
        return ObjectUtil.merge(this.defaultContext,this.parent(req,url));
    },
    processResponse: function(response){
        if(this.responseContentType)
            response.contentType = this.responseContentType;
        return response;
    }
});

exports.ringopressaction = RingoPressAction;
