include('ringo/webapp/response');
var model = require('model');

var title = 'Munteanu Gabriel - javascripter - blog admin'
//

exports.index = function (req) {
    if(req.params['id']){
        var post = model.Post.get(req.params['id']);
        post.remove();
    }
    return skinResponse('skins/admin/index.html', {
	    posts: model.Post.query().limit(5).orderBy('createTime','desc').select(),
	    content: 'gogo',
            title: title
    	});
}

exports.create = function (req){
    if(req.isGet){
	return skinResponse('skins/admin/edit.html');
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

exports.edit = function (req){
    if(req.isGet){
	return skinResponse('skins/admin/edit.html');
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
