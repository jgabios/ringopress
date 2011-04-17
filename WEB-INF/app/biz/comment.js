
/**
 * @fileOverview functions involved in handling comments
 * creating, querying, deleting, modifying.
 *
 */
var ringoString = require('ringo/utils/strings');
var model = require('model');
var CONSTANTS = require('constants');

/**
 * Retrieves the gravatar hash of the comment's author
 * by using his email
 */
var getCommentGravatarHash = function(email){
    return ringoString.digest(email.replace(/^\s+|\s+$/g, '').toLowerCase());
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
    var comments = model.Comment.query().equals('postid',postId).equals('spam',false).orderBy('createTime','desc').select();
    for(var i=0;i<comments.length;i++){
      comments[i].gravatarHash = getCommentGravatarHash(comments[i].email);
    }
    return comments;
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