var config = require('config');

export('Post','Comment');

var Post = config.store.defineEntity('Post');
var Comment = config.store.defineEntity('Comment');

Post.prototype.getCommentsCount = function(){
    return Comment.query('_id').equals('postid',this._id).select().length;
}

Post.prototype.getShortDescription = function(){
    return this.text.substring(0,132)+' ...';
}

Post.save = function(post){
    var dateUrlPart = post.createTime.format('dd-MMM');
    post.url = dateUrlPart+'-'+post.title.replace(/[^a-zA-Z0-9]/g,'-');
    post.save();
}

Post.prototype.getFormattedCreationTime = function(){
    return this.createTime.format('dd MMM yyyy');
}