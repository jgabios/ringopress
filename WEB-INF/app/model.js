var config = require('config');
var ringoDate = require('ringo/utils/dates');
var ringoString = require('ringo/utils/strings');

export('Post','Comment','PostCounter');

var Post = config.store.defineEntity('Post');
var Comment = config.store.defineEntity('Comment');
var PostCounter = config.store.defineEntity('PostCounter');

Post.prototype.getCommentsCount = function(){
    return Comment.query('_id').equals('postid',this._id).equals('spam',false).select().length;
}

Post.prototype.getShortDescription = function(){
    return ringoString.stripTags(this.text.substring(0,332))+' ...';
}

Post.save = function(post){
    var dateUrlPart = ringoDate.format(post.createTime,'dd-MMM-yyyy');
    post.url = dateUrlPart+'-'+post.title.replace(/[^a-zA-Z0-9]/g,'-');
    post.save();
    var counter = PostCounter.query().select();
    if(counter!=null && counter.length>0){
        counter[0].numberOfPosts = counter[0].numberOfPosts+1;
        counter[0].save();
    } else {
        counter = new PostCounter();
        counter['numberOfPosts']=1;
        counter.save();
    }
}

Post.prototype.getFormattedCreationTime = function(){
    return ringoDate.format(this.createTime,'dd MMM yyyy');
}

Comment.prototype.getFormattedCreationTime = function(){
    return ringoDate.format(this.createTime,'dd MMM yyyy - HH:mm');
}

Comment.prototype.getCommentText = function(){
    return this.comment.replace(/\n{1,2}/g,'<br/>');
}