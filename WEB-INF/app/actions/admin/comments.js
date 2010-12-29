var bizcomment = require('biz/comment.js').admin;

exports.action = require('action').action({
    "skin": "admin/comments.html",
    "getContext": function(env){
        if(env.req.params["action"] && env.req.params["action"]=='spam'){
            var comment = bizcomment.getCommentById(env.req.params["id"]);
            comment.spam=true;
            bizcomment.saveComment(comment);
        }
        if(env.req.params["action"] && env.req.params["action"]=='unspam'){
            var comment = bizcomment.getCommentById(env.req.params["id"]);
            comment.spam=false;
            bizcomment.saveComment(comment);
        }
        if(env.req.params["action"] && env.req.params["action"]=='delete'){
            if(env.req.params["id"]){
                var comment = bizcomment.getCommentById(env.req.params["id"]);
                bizcomment.deleteComment(comment);
            }
        }
        var currentPage = env.req.params["currentPage"] || 0;

        var comments = bizcomment.getPageComments(currentPage);
        return {
            comments: comments,
            next: ++currentPage
        };
    }
});
