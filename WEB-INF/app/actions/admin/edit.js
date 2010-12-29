
exports.action = require('action').action({
    "skin": "admin/edit.html",
    "getContext": require('lib/createeditpost').edit
});
