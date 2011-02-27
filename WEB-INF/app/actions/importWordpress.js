
/**
 * this file must be deleted after you do your initial import
 * you can use ro.rinfopress.WordpressImporter to import your wordpress posts into ringopress
 * usage: java -cp ./:pathtomysqllib.jar org.ringopress.WordpressImporter MYSQLHOST MYSQLDBNAME MYSQLUSER MYSQLPASSWD RINGOPRESSIMPORTURL
 * RINGOPRESSIMPORTURL must point to this action below
 *
 */

var CONSTANTS = require('constants');
var bizpost = require('biz/post.js');
var bizcomment = require('biz/comment.js');
var bizemail = require('biz/email.js');

exports.action = require('action').action({
    "skin": "import.html",
    "getContext": function(env){
	if(!env.req.isGet){
        if(env.req.params["post"]=="true"){
            var post = bizpost(env).createNewPost();
            post['text']=env.req.params['text'];
            post['title']=env.req.params['title'];
            post['createTime'] = new Date(parseInt(env.req.params['creationDate']));
            bizpost(env).savePost(post);
            env.req.session.data["postId"]=post._id;
        } else {
            var comment = bizcomment(env).createNewCommentFromRequestParams(env.req.params);
            comment['postid'] = req.session.data["postId"];
            comment['createTime'] = new Date(parseInt(req.params['creationDate']));
            bizcomment(env).saveComment(comment);
        }
    }
     }
});
