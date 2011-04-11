
exports = {
  plugin : {
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
  },
  hook: 'savePost',
  version: '0.1',
  author: 'jajalinux',
  email: 'example@domain.com',
  activatedByDefault: false
};