
exports.plugin = {
    hook: 'savePost',
    workAfter: function(args){
        var post = args.arguments[0];
        if(post && post.title)
            print("do something after post saving");
    },
    workBefore: function(args){
        var post = args.arguments[0];
        if(post && post.title){
            post.title+=' - suffix';
        }
    }
};