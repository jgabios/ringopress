var CONSTANTS = require('constants');
var bizpost = require('biz/post.js').admin;

exports.action = require('action').action({
    "skin": "admin/posts.html",
    "getContext": function(env){
        if(env.req.params['id']){
            var post = bizpost.getPostById(env.req.params['id']);
            bizpost.deletePost(post)
        }

        var currentPage = env.req.params["currentPage"] ? parseInt(env.req.params["currentPage"]) : 0;

        var numberOfPosts = bizpost.getNumberOfPosts();
        var showNext = numberOfPosts>=(currentPage+1)*CONSTANTS.POSTS_PER_PAGE;
        var showPrevious = currentPage >= 1;
        var posts = bizpost.getPagePosts(currentPage);
        var prev = currentPage-1;
        return {
            posts: posts,
            next: ++currentPage,
            prev: prev,
            showNext: showNext,
            showPrevious: showPrevious
        };
    }
});
