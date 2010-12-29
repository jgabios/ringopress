var CONSTANTS = require('constants');

exports.action = require('action').action({
    "skin": "contact.html",
    "getContext": function(env){
        return {
            page: {
                title: CONSTANTS.BLOG_TITLE+' - contact me'
                }
        };
    }
});
