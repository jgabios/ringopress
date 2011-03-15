var gae2 = require('gae2.gae');

exports.action = require('action').action({
    "skin": "test.html",
    "getContext": function(env){
        gae2.gae2();
        return {
            
        };
    }
});