var CONSTANTS = require('constants');
var EmailMessage = require("google/appengine/api/mail").EmailMessage;


var sendNewCommentEmail = function(emailData){
    var emailBody = 'you got a new comment on your post:\r\n';
    emailBody += 'http://'+emailData.env.req.host+emailData.env.req.pathDecoded+' - '+emailData.post.title+'\r\n';
    emailBody += 'author: '+emailData.comment.author+' [ '+emailData.comment.email+' ] from '+emailData.comment.website+'\r\n-----------------------\r\n';
    emailBody += emailData.comment.comment+'\r\n';
    emailBody += 'go here to manage it: http://'+emailData.env.req.host+'/admin/comments/';
    new EmailMessage({
        from: CONSTANTS.EMAIL,
        to: CONSTANTS.EMAIL,
        body: emailBody,
        subject: 'new comment from '+emailData.comment.author
        }).send();
}
    
exports = require('biz/lib/bizexports').bizexport(this);

exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);