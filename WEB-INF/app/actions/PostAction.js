var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');
var model = require('model');
var mail = require('ringo/mail');
var ObjectUtil = require('ringo/utils/objects');

var PostAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/post.html";
    },
    getContext: function(req,url){
        var posts = model.Post.query().equals('url', url).select();
        var post = posts[0];
        //post.text = post.text.replace(/\r/g,"");
        //post.text = post.text.replace(/\n{1,2}/g,"<br/>");
        if(!req.isGet){
            var comment = new model.Comment();
            for each (var key in ['author', 'email','website','comment','postid']) {
                comment[key] = req.params[key];
            }
            comment['createTime'] = new Date();
            var commentsApprovedForThisEmail = model.Comment.query().equals('email',comment.email).equals('spam',false).select();
            if(commentsApprovedForThisEmail.length==0)
                comment.spam=true;
            else
                comment.spam=false;
            comment.save();
            var emailBody = 'you got a new comment on your post:\r\n';
            emailBody += 'http://'+req.host+req.pathDecoded+' - '+post.title+'\r\n';
            emailBody += 'author: '+comment.author+' [ '+comment.email+' ] from '+comment.website+'\r\n-----------------------\r\n';
            emailBody += comment.comment+'\r\n';
            emailBody += 'go here to manage it: http://'+req.host+'/admin/comments/';
            mail.gsend({
                from: CONSTANTS.EMAIL,
                to: CONSTANTS.EMAIL,
                text: emailBody,
                subject: 'new comment from '+comment.author
                });
        }
        var comments = model.Comment.query().equals('postid',post._id).equals('spam',false).orderBy('createTime','desc').select();
        return ObjectUtil.merge({
            page: {
                title: CONSTANTS.BLOG_TITLE+' '+post.title
                },
            post: post,
            comments: comments
        },this.parent(req,url));
    }
});

var post =  new PostAction();
exports.post = post.process.bind(post);
