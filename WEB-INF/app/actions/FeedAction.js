var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var model = require('model');
var ringoDate = require('ringo/utils/dates');
var ObjectUtil = require('ringo/utils/objects');

var FeedAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/feed.xml";
    },
    getContext: function(req,url){
        var posts = model.Post.query().limit(10).orderBy('createTime','desc').select();
        var lastNewsTime = ringoDate.format(posts[0].createTime,'EEE, dd MMM yyyy HH:mm:ss Z');
        return ObjectUtil.merge({
            domain: req.host,
            lastBuildDate: lastNewsTime,
            posts: posts
        },this.parent(req,url));
    },
    processResponse: function(response){
        response.contentType='text/xml';
        return response;
    }
});

var feed =  new FeedAction();
exports.feed = feed.process.bind(feed);
