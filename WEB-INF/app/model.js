/**
 * @fileOverview model.js contains our value objects, that we use to model our application.
 * we have a mix of ringojs model and appenginejs way of doing things.
 * I will keep the appenginejs way, as I intend to make ringopress google appengine only.
 */
var config = require('config');
var ringoDate = require('ringo/utils/dates');
var ringoString = require('ringo/utils/strings');
var db = require("google/appengine/ext/db");

// maybe i will go full appenginejs low-level GDS with the entities and persistence
// for now, only the plugins stored in the db will be GDS [google datastore]
export('Post','Comment','PostCounter','Plugin');

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

var Plugin = db.Model("plugin", {
    code: new db.TextProperty(),
    lastModified: new db.DateProperty(),
    name: new db.StringProperty(),
    version: new db.StringProperty(),
    author: new db.StringProperty(),
    email: new db.StringProperty(),
    hook: new db.StringProperty(),
    type: new db.StringProperty(), // file or code as blob
    activated: new db.BooleanProperty()
});
