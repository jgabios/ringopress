var ringoDate = require('ringo/utils/dates');
var ringoString = require('ringo/utils/strings');
var model = require('model');
var CONSTANTS = require('constants');

var savePost = function(post){
    var dateUrlPart = ringoDate.format(post.createTime,'dd-MMM-yyyy');
    post.url = dateUrlPart+'-'+post.title.replace(/[^a-zA-Z0-9]/g,'-');
    post.save();
    var counter = model.PostCounter.query().select();
    if(counter!=null && counter.length>0){
        counter[0].numberOfPosts = counter[0].numberOfPosts+1;
        counter[0].save();
    } else {
        counter = new model.PostCounter();
        counter['numberOfPosts']=1;
        counter.save();
    }
}

var getNumberOfPosts = function(){
    var counter = model.PostCounter.query().select();
    var numberOfPosts = 0;
    if(counter && counter.length>0)
        numberOfPosts = counter[0].numberOfPosts;
    return numberOfPosts;
}

var getPostNumberOfValidatedComments = function(post){
    return Comment.query('_id').equals('postid',post._id).equals('spam',false).select().length;
}

var getPostShortDescription = function(post){
    return ringoString.stripTags(post.text.substring(0,332))+' ...';
}

var getPagePosts = function(currentPage){
    return model.Post.query().orderBy('createTime','desc').offset(currentPage*CONSTANTS.POSTS_PER_PAGE).limit(CONSTANTS.POSTS_PER_PAGE).select();
}

var getFeedPosts = function(){
    return model.Post.query().orderBy('createTime','desc').offset(0).limit(CONSTANTS.FEED_MAXNUMBER_POSTS).select();
}

var getPostById = function(postId){
    return model.Post.get(postId);
}

var createNewPost = function(){
    var post = new model.Post();
    post['createTime'] = new Date();
    return post;
}

var deletePost = function(post){
    post.remove();
    var counter = model.PostCounter.query().select();
    counter[0].numberOfPosts=counter[0].numberOfPosts-1;
    counter[0].save();
}

var getPostByURL = function(url){
    var posts = model.Post.query().equals('url', url).select();
    if(posts && posts.length>0)
        return posts[0];
    else
        return null;
}

exports = require('biz/lib/bizexports').bizexport(this);

exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);