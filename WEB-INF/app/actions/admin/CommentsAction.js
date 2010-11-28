var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var model = require('model');
var ObjectUtil = require('ringo/utils/objects');

var CommentsAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/admin/comments.html";
    },
    getContext: function(req,url){
        if(req.params["action"] && req.params["action"]=='spam'){
        var comment = model.Comment.get(req.params["id"]);
        comment.spam=true;
        comment.save();
    }
    if(req.params["action"] && req.params["action"]=='unspam'){
        var comment = model.Comment.get(req.params["id"]);
        comment.spam=false;
        comment.save();
    }
    if(req.params["action"] && req.params["action"]=='delete'){
        if(req.params["id"]){
            var comment = model.Comment.get(req.params["id"]);
            comment.remove();
        }
    }
    var next = req.params["next"];
    if(!next){
        next=0;
    } else {
        next=parseInt(next);
    }

    var comments = model.Comment.query().limit(CONSTANTS.POSTS_PER_PAGE).offset(next*CONSTANTS.POSTS_PER_PAGE).orderBy('createTime','desc').select();
    return ObjectUtil.merge({
            comments: comments,
            next: ++next
        },this.parent(req,url));
    }
});

var commentsAction =  new CommentsAction();
exports.comments = commentsAction.process.bind(commentsAction);
