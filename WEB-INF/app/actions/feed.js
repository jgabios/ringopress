var bizpost = require('biz/post.js');
var ringoDate = require('ringo/utils/dates');

var FEED_MAXNUMBER_POSTS = 10;

exports.action = require('action').action({
    "skin": "feed.xml",
    "getContext": function(env){
        var posts = bizpost(env).getFeedPosts();
        var lastNewsTime = ringoDate.format(posts[0].createTime,'EEE, dd MMM yyyy HH:mm:ss Z');
        env.resp.contentType='text/xml';
        return {
            domain: env.req.host,
            lastBuildDate: lastNewsTime,
            posts: posts
        };
    }
});
