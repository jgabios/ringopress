exports = require('actionManager.js').getActions(['index','post','contact','feed','importWordpress'],'actions/');

// we could use just:
// exports = require('actionManager.js').getActions(null,'actions/');
// and we will get all files in folder actions/ to act as ringojs actions
