
var IndexAdminAction = require('lib/IndexAdminAction').IndexAdminAction;
var index =  new IndexAdminAction();
exports.index = index.process.bind(index);
