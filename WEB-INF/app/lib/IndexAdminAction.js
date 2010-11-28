var indexAction = require('lib/IndexAction');
var MT = require('mootools-core-1.3-server.js');
var model = require('model');

var IndexAdminAction = new MT.Class({
    Extends: indexAction.IndexAction,
    initialize: function(){
        this.parent();
        this.skin="skins/admin/index.html";
    },
    getContext: function(req,url){
        var counter = model.PostCounter.query().select();
        if(req.params['id']){
            var post = model.Post.get(req.params['id']);
            post.remove();
            counter[0].numberOfPosts=counter[0].numberOfPosts-1;
            counter[0].save();
        }
        return this.parent(req,url);
    }
});

exports.IndexAdminAction = IndexAdminAction;