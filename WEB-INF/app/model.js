var config = require('config');
var ringoDate = require('ringo/utils/dates');
var ringoString = require('ringo/utils/strings');

export('Post','Comment','PostCounter');

var Post = config.store.defineEntity('Post');
var Comment = config.store.defineEntity('Comment');
var PostCounter = config.store.defineEntity('PostCounter');

//// this should go to view layer
Post.prototype.getCommentsCountText = function(){
    var numberOfComments = Comment.query('_id').equals('postid',this._id).equals('spam',false).select().length;
    return numberOfComments+(numberOfComments==1 ? ' comment ' : ' comments ');
}
//// this should go to view layer
Post.prototype.getFormattedCreationTime = function(){
    return ringoDate.format(this.createTime,'dd MMM yyyy');
}
//// this should go to view layer
Comment.prototype.getFormattedCreationTime = function(){
    return ringoDate.format(this.createTime,'dd MMM yyyy - HH:mm');
}
//// this should go to view layer
Comment.prototype.getCommentText = function(){
    return this.comment.replace(/\n{1,2}/g,'<br/>');
}

Post.prototype.getShortDescription = function(){
    return ringoString.stripTags(this.text.substring(0,332))+' ...';
}