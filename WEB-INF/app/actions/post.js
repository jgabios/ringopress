var CONSTANTS = require('constants');
var bizpost = require('biz/post.js');
var bizcomment = require('biz/comment.js');
var bizemail = require('biz/email.js');

exports.action = require('action').action({
    "skin": "post.html",
    "getContext": function(env){
        var post = bizpost(env).getPostByURL(env.url);
        if(!env.req.isGet){
            var comment = bizcomment(env).createNewCommentFromRequestParams(env.req.params);
            if(!comment.email){
                var comments = bizcomment(env).getCommentsByPostId(post._id);
                return {
                    page: {
                        title: CONSTANTS.BLOG_TITLE+' '+post.title
                        },
                    post: post,
                    comments: comments,
                    comment: comment
                };
            }
            
            comment.spam = !bizcomment(env).isCommentAuthorWhitelisted(comment.email);
            bizcomment(env).saveComment(comment);
            bizemail(env).sendNewCommentEmail({env: env,comment: comment,post: post});
        }
        var comments = bizcomment(env).getCommentsByPostId(post._id);
        return {
            page: {
                title: CONSTANTS.BLOG_TITLE+' '+post.title
                },
            post: post,
            comments: comments
        };
    }
});
