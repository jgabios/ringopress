var config = require('config');

export('Post','Comment');

var Post = config.store.defineEntity('Post');
var Comment = config.store.defineEntity('Comment');

Post.prototype.getCommentsCount = function(){
    return Comment.query('_id').equals('postid',this._id).select().length;
}

Post.prototype.getShortDescription = function(){
    return this.text.substring(0,32);
}

Post.prototype.save = function(){
    this.url = this.title.replace('/[^a-zA-Z0-9]/g','-');
    this.save();
}

Comment.prototype.renderAuthor = function(){
    if(this.website.length>3)
        return '<a href';
    else
        return 'wewe';
}