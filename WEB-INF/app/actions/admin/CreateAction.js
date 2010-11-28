var ManagePostAction = require('lib/ManagePostAction').ManagePostAction;

var createAction =  new ManagePostAction();
exports.create = createAction.process.bind(createAction);
