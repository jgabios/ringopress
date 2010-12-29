var bizpost = require('biz/post.js').admin;

var createedit = function(env){
    var post = null;
    if(env.req.params['id'])
        post = bizpost.getPostById(env.req.params['id']);
    if(env.req.isGet){
        if(post){
            return {
                post: post
            }
        } else
            return {};
    }
    if(env.req.isPost){
        if(!post){
            post = bizpost.createNewPost();
        } else {
            post['updateTime'] = new Date();
        }
        post['text'] = env.req.params['text'];
        post['title'] = env.req.params['title'];
        bizpost.savePost(post);
        return {
            status: 'redirect',
            url: '/admin'
        };
    };
}
exports.create = createedit;
exports.edit = createedit;
