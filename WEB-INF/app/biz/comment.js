var ringoString = require('ringo/utils/strings');
var model = require('model');
var CONSTANTS = require('constants');

var getCommentGravatarHash = function(comment){
    return ringoString.digest(comment.email.replace(/^\s+|\s+$/g, '').toLowerCase());
}

var createNewComment = function(){
    return new model.Comment();
}

var createNewCommentFromRequestParams = function(params){
    var comment = createNewComment();
    comment['author'] = params['author'];
    comment['email'] = params['email'];
    comment['website'] = params['website'];
    comment['comment'] = params['comment'];
    comment['postid'] = params['postid'];
    comment['createTime'] = new Date();
    return comment;
}

var getCommentsByPostId = function(postId){
    return model.Comment.query().equals('postid',postId).equals('spam',false).orderBy('createTime','desc').select();
}

var getCommentById = function(id){
    return model.Comment.get(id);
}

var isCommentAuthorWhitelisted = function(email){
    var commentsApprovedForThisEmail = model.Comment.query().equals('email',email).equals('spam',false).select();
    return commentsApprovedForThisEmail.length>0;
}

var saveComment = function(comment){
    comment.save();
}

var deleteComment = function(comment){
    comment.remove();
}

var getPageComments = function(currentPage){
    return model.Comment.query().orderBy('createTime','desc').offset(currentPage*CONSTANTS.POSTS_PER_PAGE).limit(CONSTANTS.POSTS_PER_PAGE).select();
}
exports = require('biz/lib/bizexports').bizexport(this);
exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);