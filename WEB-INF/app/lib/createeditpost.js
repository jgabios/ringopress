var bizpost = require('biz/post.js');

var createedit = function(env){
    var post = null;
    if(env.req.params['id'])
        post = bizpost(env).getPostById(env.req.params['id']);
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
            post = bizpost(env).createNewPost();
        } else {
            post['updateTime'] = new Date();
        }
        post['text'] = env.req.params['text'];
        post['title'] = env.req.params['title'];
        bizpost(env).savePost(post);
        return {
            status: 'redirect',
            url: '/admin/posts'
        };
    }
}
exports.create = createedit;
exports.edit = createedit;
