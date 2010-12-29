/**
 * @fileOverview provides the feed
 * the type of the feed, the header, and many other stuff not related to posts
 * can be set directly in the xml theme/skin file [default: skins/default/feed.xml]
 * 
 */

var bizpost = require('biz/post.js');
var ringoDate = require('ringo/utils/dates');

var DATETIME_FORMAT = 'EEE, dd MMM yyyy HH:mm:ss Z';

/**
 * @return {Object} context that contains:
 * <ul>
 * <li> domain of the blog
 * <li> last time it has been updated [the ceation time of the latest post]
 * <li> the latest posts array
 * </u>
 * 
 * the max number of posts in the array can be set in the app/constants.js file
 * in the variable FEED_MAXNUMBER_POSTS.
 * 
 */
exports.action = require('action').action({
    "skin": "feed.xml",
    "getContext": function(env){
        var posts = bizpost(env).getFeedPosts();
        var lastNewsTime = posts.length>0 ? ringoDate.format(posts[0].createTime,DATETIME_FORMAT) : ringoDate.format(new Date(),DATETIME_FORMAT);
        env.resp.contentType='text/xml';
        return {
            domain: env.req.host,
            lastBuildDate: lastNewsTime,
            posts: posts
        };
    }
});
