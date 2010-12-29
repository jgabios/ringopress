var CONSTANTS = require('constants');
var bizpost = require('biz/post.js');

exports.action = require('action').action({
    "skin": "index.html",
    "getContext": function(env){
        var currentPage = env.req.params["currentPage"] ? parseInt(env.req.params["currentPage"]) : 0;

        var numberOfPosts = bizpost(env).getNumberOfPosts();
        var showNext = numberOfPosts>=(currentPage+1)*CONSTANTS.POSTS_PER_PAGE;
        var showPrevious = currentPage >= 1;
        var posts = bizpost(env).getPagePosts(currentPage);
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
