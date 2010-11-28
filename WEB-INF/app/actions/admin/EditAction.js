var ManagePostAction = require('lib/ManagePostAction').ManagePostAction;

var editAction =  new ManagePostAction();
exports.edit = editAction.process.bind(editAction);
