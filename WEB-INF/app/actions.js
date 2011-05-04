/**
 * @fileOverview exports the actions that will handle the requests
 * see config.js for where it is used:
 * --------------------
 * <code>
 * exports.urls = [
 *  ['/admin','adminactions'],
 *  ['/', 'actions']
 * ];
 * </code>
 * --------------------
 * we could use just:
 * exports = require('actionManager.js').getActions(null,'actions/');
 * and we will get all files in folder actions/ to act as ringojs actions
 *
 */

exports = require('actionManager.js').getActions(['index','post','contact','feed','importWordpress'],'actions/');


