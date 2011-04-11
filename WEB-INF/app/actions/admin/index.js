var CONSTANTS = require('constants');
var bizpost = require('biz/post.js').admin;

exports.action = require('action').action({
    "skin": "admin/index.html",
    "getContext": function(env){
        return {};
    }
});
