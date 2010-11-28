
var IndexAction = require('lib/IndexAction').IndexAction;

var index =  new IndexAction();
exports.index = index.process.bind(index);
