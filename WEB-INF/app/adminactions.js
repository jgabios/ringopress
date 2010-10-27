include('ringo/webapp/response');
var model = require('model');
var CONSTANTS = require('constants');

var title = CONSTANTS.BLOG_TITLE+' - blog admin';
//

exports.index = function (req) {
    var next = req.params["next"];
    if(!next){
        next=0;
    } else {
        next=parseInt(next);
    }

    var counter = model.PostCounter.query().select();
    var numberOfPosts = 0;
    if(counter && counter.length>0)
        numberOfPosts = counter[0].numberOfPosts;
    var showNext = numberOfPosts>=(next+1)*CONSTANTS.POSTS_PER_PAGE;
    var prev = next-1;
    var showPrevious = next >= 1;

    if(req.params['id']){
        var post = model.Post.get(req.params['id']);
        post.remove();
        counter[0].numberOfPosts=counter[0].numberOfPosts-1;
        counter[0].save();
    }
    return Response.skin('skins/admin/index.html', {
        posts: model.Post.query().limit(CONSTANTS.POSTS_PER_PAGE).offset(next*CONSTANTS.POSTS_PER_PAGE).orderBy('createTime','desc').select(),
        content: 'gogo',
        title: title,
        next: ++next,
        prev: prev,
        showNext: showNext,
        showPrevious: showPrevious
    });
}

exports.create = function (req){
    if(req.isGet){
        return Response.skin('skins/admin/edit.html');
    } else {
        var post = new model.Post();
        for each (var key in ['text', 'title']) {
            post[key] = req.params[key];
        }
        post['createTime'] = new Date();
        model.Post.save(post);
        return Response.redirect('/admin');
    }
}

exports.edit = function (req){
    var post = model.Post.get(req.params['id']);
    if(req.isGet){
        return Response.skin('skins/admin/edit.html',{
            post: post
        });
    } else {
        for each (var key in ['text', 'title']) {
            post[key] = req.params[key];
            post['updateTime'] = new Date();
        }
        model.Post.save(post);
        return Response.redirect('/admin');
    }
}

exports.comments = function (req) {
    if(req.params["action"] && req.params["action"]=='spam'){
        var comment = model.Comment.get(req.params["id"]);
        comment.spam=true;
        comment.save();
    }
    if(req.params["action"] && req.params["action"]=='unspam'){
        var comment = model.Comment.get(req.params["id"]);
        comment.spam=false;
        comment.save();
    }
    if(req.params["action"] && req.params["action"]=='delete'){
        if(req.params["id"]){
            var comment = model.Comment.get(req.params["id"]);
            comment.remove();
        }
    }
    var next = req.params["next"];
    if(!next){
        next=0;
    } else {
        next=parseInt(next);
    }

    var comments = model.Comment.query().limit(CONSTANTS.POSTS_PER_PAGE).offset(next*CONSTANTS.POSTS_PER_PAGE).orderBy('createTime','desc').select();
    return Response.skin('skins/admin/comments.html',{
            comments: comments,
            next: ++next
        });
}