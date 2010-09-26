include('ringo/webapp/response');
var model = require('model');

var title = 'Munteanu Gabriel - javascripter'
//

exports.index = function (req) {
	return skinResponse('skins/index.html', {
	    posts: model.Post.query().limit(5).orderBy('createTime','desc').select(),
	    content: 'gogo',
            title: title
    	});
}

exports.create = function (req){
    if(req.isGet){
	return skinResponse('skins/edit.html');
    } else {
	var post = new model.Post();
	for each (var key in ['text', 'title']) {
    	    post[key] = req.params[key];
            post['createTime'] = new Date();
	}
	post.save();
	return redirectResponse('/');
    }
}

exports.post = function (req,url){
    var post = model.Post.query().equals('url', url);
    if(!req.isGet){
	var comment = new model.Comment();
	for each (var key in ['author', 'email','website','comment','postid']) {
    	    comment[key] = req.params[key];
            comment['createTime'] = new Date();
	}
	comment.save();
    }
    var comments = model.Comment.query().equals('postid',post._id).orderBy('createTime','desc').select();
    return skinResponse('skins/post.html',{
        post: post,
        comments: comments
    });
}

exports.contact = function () {
	return skinResponse('skins/contact.html', {
            title: title+' - contact me'
    	});
}

exports.feed = function(){
    var posts = model.Post.query().limit(10).orderBy('createTime','desc').select();
    var lastNewsTime = posts[0].createTime.format('EEE, dd MMM yyyy HH:mm:ss Z');
    var response = skinResponse('skins/feed.xml', {
        title: title,
        lastBuildDate: lastNewsTime,
        posts: posts
    });
    response.contentType='text/xml';
    return response;
}