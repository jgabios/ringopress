include('ringo/webapp/response');
var model = require('model');
var mail = require('ringo/mail');
var ringoDate = require('ringo/utils/dates');
var CONSTANTS = require('constants');
//

exports.index = function (req) {
    var next = req.params["next"];
    if(!next){
        next=0;
    } else {
        next=parseInt(next);
    }

    var counter = model.PostCounter.query().select();
    var numberOfPosts = 0;
    if(counter && counter.length>0)
        numberOfPosts = counter[0].numberOfPosts;
    var showNext = numberOfPosts>=(next+1)*CONSTANTS.POSTS_PER_PAGE;
    var prev = next-1;
    var showPrevious = next >= 1;
    return Response.skin('skins/index.html', {
        posts: model.Post.query().limit(CONSTANTS.POSTS_PER_PAGE).offset(next*CONSTANTS.POSTS_PER_PAGE).orderBy('createTime','desc').select(),
        content: 'gogo',
        title: CONSTANTS.BLOGTITLE,
        next: ++next,
        prev: prev,
        showNext: showNext,
        showPrevious: showPrevious
    });
}

/**
 * this function must be deleted after you do your initial import
 * you can use ro.rinfopress.WordpressImporter to import your wordpress
 */
exports.importPosts = function(req){
    if(!req.isGet){
        if(req.params["post"]=="true"){
            var post = new model.Post();
            for each (var key in ['text', 'title']) {
                post[key] = req.params[key];
            }
            post['createTime'] = new Date(parseInt(req.params['creationDate']));
            model.Post.save(post);
            req.session.data["postId"]=post._id;
        } else {
            var comment = new model.Comment();
            for each (var key in ['author', 'email','website','comment']) {
                comment[key] = req.params[key];
            }
            comment['postid'] = req.session.data["postId"];
            comment['createTime'] = new Date(parseInt(req.params['creationDate']));
            comment.spam=false;
            comment.save();
        }
    }
    return Response.skin('skins/import.html',{
        sessData: 'ok'
    });
}

exports.post = function (req,url){
    var posts = model.Post.query().equals('url', url).select();
    var post = posts[0];
    //post.text = post.text.replace(/\r/g,"");
    //post.text = post.text.replace(/\n{1,2}/g,"<br/>");
    if(!req.isGet){
        var comment = new model.Comment();
        for each (var key in ['author', 'email','website','comment','postid']) {
            comment[key] = req.params[key];
        }
        comment['createTime'] = new Date();
        var commentsApprovedForThisEmail = model.Comment.query().equals('email',comment.email).equals('spam',false).select();
        if(commentsApprovedForThisEmail.length==0)
            comment.spam=true;
        else
            comment.spam=false;
        comment.save();
        emailBody = 'you got a new comment on your post:\r\n';
        emailBody += 'http://bash.editia.info'+req.pathDecoded+' - '+post.title+'\r\n';
        emailBody += 'author: '+comment.author+' [ '+comment.email+' ] from '+comment.website+'\r\n-----------------------\r\n';
        emailBody += comment.comment;
        mail.gsend({from: CONSTANTS.EMAIL, to: CONSTANTS.EMAIL,text: emailBody,subject: 'new comment from '+comment.author});
    }
    var comments = model.Comment.query().equals('postid',post._id).equals('spam',false).orderBy('createTime','desc').select();
    return Response.skin('skins/post.html',{
        post: post,
        comments: comments
    });
}

exports.contact = function () {
    return Response.skin('skins/contact.html', {
        title: CONSTANTS.BLOG_TITLE+' - contact me'
    });
}

exports.feed = function(){
    var posts = model.Post.query().limit(10).orderBy('createTime','desc').select();
    var lastNewsTime = ringoDate.format(posts[0].createTime,'EEE, dd MMM yyyy HH:mm:ss Z');
    var response = Response.skin('skins/feed.xml', {
        title: CONSTANTS.BLOG_TITLE,
        lastBuildDate: lastNewsTime,
        posts: posts
    });
    response.contentType='text/xml';
    return response;
}
/**
 * this will be implemented when i will switch to appenginejs
 */
exports.testemail = function(){
    var EmailMessage = require("mail").EmailMessage;

    new EmailMessage({
        sender: "from@gmail.com",
        to: "to@gmail.com",
        subject: "My email test",
        body: 'test'
    }).send();
    return Response.skin('skins/import.html',{
        sessData: 'ok'
    });
}