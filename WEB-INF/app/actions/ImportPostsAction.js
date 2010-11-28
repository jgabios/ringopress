var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var model = require('model');

var ImportPostsAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/index.html";
    },
    getContext: function(req,url){
        if(!req.isGet){
            if(req.params["post"]=="true"){
                var post = new model.Post();
                for each (var key in ['text', 'title']) {
                    post[key] = req.params[key];
                }
                post['createTime'] = new Date(parseInt(req.params['creationDate']));
                model.Post.save(post);
                req.session.data["postId"]=post._id;
            } else {
                var comment = new model.Comment();
                for each (var key in ['author', 'email','website','comment']) {
                    comment[key] = req.params[key];
                }
                comment['postid'] = req.session.data["postId"];
                comment['createTime'] = new Date(parseInt(req.params['creationDate']));
                comment.spam=false;
                comment.save();
            }
        }
        return {
            sessData: 'ok'
        };
    }
});

var importposts =  new ImportPostsAction();
exports.importposts = importposts.process.bind(importposts);
