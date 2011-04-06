/**
 * @fileOverview runs some tests on google datastore
 * the appenginejs package must be installed in your ringojs setup
 * additionally, in RINGOJS_HOME/lib folder we must add:
 * - appengine-api-1.0-sdk-1.4.2.jar from APPENGINE_SDK_HOME/lib/user/appengine-api-1.0-sdk-1.4.2.jar
 * - appengine-api-stubs.jar from APPENGINE_SDK_HOME/lib/impl/appengine-api-stubs.jar
 * - appengine-testing.jar from APPENGINE_SDK_HOME/lib/testing/appengine-testing.jar
 */

var localServiceTestHelper = com.google.appengine.tools.development.testing.LocalServiceTestHelper;
var localDBTestConfig = com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
var helper = new localServiceTestHelper(new localDBTestConfig());
helper.setUp();
var m = require('model');
var bizplugin = require('biz/plugin.js').admin;
var plugin = bizplugin.getPluginByName('gabi');
print(plugin.name);