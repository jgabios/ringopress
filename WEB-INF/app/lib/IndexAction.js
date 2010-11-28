
var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var model = require('model');
var ObjectUtil = require('ringo/utils/objects');

var IndexAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/index.html";
    },
    getContext: function(req,url){
        var next = req.params["next"];
        if(!next){
            next=0;
        } else {
            next=parseInt(next);
        }

        var counter = model.PostCounter.query().select();
        var numberOfPosts = 0;
        if(counter && counter.length>0)
            numberOfPosts = counter[0].numberOfPosts;
        var showNext = numberOfPosts>=(next+1)*CONSTANTS.POSTS_PER_PAGE;
        var prev = next-1;
        var showPrevious = next >= 1;
        var posts = model.Post.query().limit(CONSTANTS.POSTS_PER_PAGE).offset(next*CONSTANTS.POSTS_PER_PAGE).orderBy('createTime','desc').select();
        return ObjectUtil.merge({
            posts: posts,
            next: ++next,
            prev: prev,
            showNext: showNext,
            showPrevious: showPrevious
        },this.parent(req,url));
    }
});

exports.IndexAction = IndexAction;