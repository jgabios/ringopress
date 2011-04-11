
exports = {
  plugin : {
    workBefore: function(args){
      var akismet = require('akismet');
      var comment = args.arguments[0];
      var isSpam = akismet.submitSpam({
        ipAddress: args.env.req.remoteAddr,
        userAgent: args.env.req.getHeader('user-agent'),
        referrer: args.env.req.getHeader('referer'),
        permaLink: args.env.req.host+args.env.req.path,
        commentType: 'comment',
        author: comment.author,
        authorEmail: comment.email,
        authorURL: comment.website,
        comment: comment.comment
      });
      comment.spam = isSpam;
    }
  },
  version: '0.2',
  author: 'mama',
  email: 'example@domain.com',
  activatedByDefault: true,
  hook: 'saveComment'
};
