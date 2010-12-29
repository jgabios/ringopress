/**
 * @fileOverview provides akismet API calls to check if comments are spam
 * requires an object in the config module of your ringo webapp
 * the object is a name-value json object that must contain your akismet apikey and blogname
 * 
 */

var config = require('config').akismet || {
  apikey: 'XXXXXXXXX',
  blog: 'http://XXXXXXXXXX'
}

// adding the verify-key URL to the config object. we know it, you don't have to worry about it.
config['akismetVerifyKeyURL']='http://rest.akismet.com/1.1/verify-key';

var fetch = require("google/appengine/api/urlfetch").fetch;

/**
 * checks if your key/blog pair is valid on akismet
 * returns {boolean}
 */
exports.verifyKey = function(){
  var response = fetch(config.akismetVerifyKeyURL,'key='+config.apikey+'&blog='+config.blog,'POST');
  var html = response.content.decodeToString("UTF-8");
  return html === 'valid';
}

var akismetCall = function(akismetParams){
  var callResult = false;
  var akismetURL = "http://" + config.apiKey + ".rest.akismet.com/1.1/" + akismetParams.action;
  var payLoad = 'blog='+config.blog;
  if(akismetParams.ipAddress)
    payLoad+='&user_ip='+akismetParams.ipAddress;
  if(akismetParams.userAgent)
    payLoad+='&user_agent='+akismetParams.userAgent;
  if(akismetParams.referrer)
    payLoad+='&referrer='+akismetParams.referrer;
  if(akismetParams.permaLink)
    payLoad+='&permaLink='+akismetParams.permaLink;
  if(akismetParams.commentType)
    payLoad+='&comment_type='+akismetParams.commentType;
  if(akismetParams.author)
    payLoad+='&comment_author='+akismetParams.author;
  if(akismetParams.authorEmail)
    payLoad+='&comment_author_email='+akismetParams.authorEmail;
  if(akismetParams.authorURL)
    payLoad+='&comment_author_url='+akismetParams.authorURL;
  if(akismetParams.comment)
    payLoad+='&comment_content='+akismetParams.comment;
  if(akismetParams.other){
    for(var key in akismetParams.other){
      payLoad+='&'+key+'='+akismetParams.other[key];
    }
  }
  var response = fetch(akismetURL,payLoad,'POST');
  var html = response.content.decodeToString("UTF-8");
  if(html.indexOf('false')==-1)
    callResult = true;
  return callResult;
}

/**
 * commentCheck is the most used function.
 * here you pass an object of parameters to submit to akismet service
 * [the more you submit the better]
 * here is a complete one :
 * {
 * ipAddress: 1.2.3.4,
 * userAgent: 'the userAgent',
 * referrer: 'the referrer',
 * permaLink: 'the link of the post where the guy commented on',
 * commentType: 'can be empty, or have the following values: "comment","trackback","pingback", it can have other value, no harm will be done',
 * author: '',
 * authorEmail: '',
 * authorURL: '',
 * comment: 'the comment content he submited',
 * 
 * }
 * all of these properties are about the person who submited the comment.
 * 
 * @returns {boolean} if true, it means it is spam
 */
exports.commentCheck = function(akismetParams){
  akismetParams['action']='comment-check';
  return akismetCall(akismetParams);
}

/**
 * This call is for submitting comments that weren't marked as spam but should have been.
 */
exports.submitSpam = function(akismetParams){
  akismetParams['action']='submit-spam';
  return akismetCall(akismetParams);
}

/**
 * This call is intended for the marking of false positives, things that were incorrectly marked as spam. 
 */
exports.submitHam = function(akismetParams){
  akismetParams['action']='submit-ham';
  return akismetCall(akismetParams);
}


