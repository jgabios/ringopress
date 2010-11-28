var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var model = require('model');
var {Response} = require('ringo/webapp/response');
var ObjectUtil = require('ringo/utils/objects');

var ManagePostAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/admin/edit.html";
    },
    getContext: function(req,url){
        return this.parent(req,url);
    },
    process: function(req,url){
        var post = null;
        if(req.params['id'])
            post = model.Post.get(req.params['id']);
        if(req.isGet){
            return Response.skin(this.skin,req.params['id'] ? ObjectUtil.merge({post: post},this.getContext(req,url)) : this.getContext(req,url));
        } else {
            if(!post)
                post = new model.Post();
            for each (var key in ['text', 'title']) {
                post[key] = req.params[key];
            }
            post['createTime'] = new Date();
            model.Post.save(post);
            return Response.redirect('/admin');
        }
    }
});

exports.ManagePostAction = ManagePostAction;
