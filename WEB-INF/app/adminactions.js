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
 * This is for admin part
 * we could use just:
 * exports = require('actionManager.js').getActions(null,'actions/');
 * and we will get all files in folder actions/admin to act as ringojs actions
 *
 */

exports = require('actionManager.js').getActions(null,'actions/admin/');
