var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var ObjectUtil = require('ringo/utils/objects');

var ContactAction = new MT.Class({
        Extends: defaultAction.ringopressaction,
        initialize: function(){
                this.parent();
                this.skin="skins/contact.html";
        },
        getContext: function(req,url){
            return ObjectUtil.merge({
                page: {title: CONSTANTS.BLOG_TITLE+' - contact me'}
            },this.parent(req,url));
        }
});

var cp =  new ContactAction();
exports.contact = cp.process.bind(cp);