/**
 * @fileOverview runs some tests on google datastore
 * the appenginejs package must be installed in your ringojs setup
 * additionally, in RINGOJS_HOME/lib folder we must add:
 * - appengine-api-1.0-sdk-1.4.2.jar from APPENGINE_SDK_HOME/lib/user/appengine-api-1.0-sdk-1.4.2.jar
 * - appengine-api-stubs.jar from APPENGINE_SDK_HOME/lib/impl/appengine-api-stubs.jar
 * - appengine-testing.jar from APPENGINE_SDK_HOME/lib/testing/appengine-testing.jar
 *
 * It should be run from WEB-INF/app folder as i have relative paths in the code.
 * 
 */
require('ringo/engine').addRepository("./");
var localServiceTestHelper = com.google.appengine.tools.development.testing.LocalServiceTestHelper;
var localDBTestConfig = com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
var nsManager = com.google.appengine.api.NamespaceManager;
var dbConfig = new localDBTestConfig();
dbConfig.setNoStorage(false);
dbConfig.setNoIndexAutoGen(true);
dbConfig.setBackingStoreLocation('../appengine-generated/local_db.bin');
var helper = new localServiceTestHelper(dbConfig);
helper.setUp();
print(nsManager+' -- '+nsManager.getGoogleAppsNamespace());
nsManager.set(nsManager.getGoogleAppsNamespace());
helper.setEnvAppId("jajabash");
helper.setEnvAuthDomain("gmail.com");
var m = require('model');
var bizplugin = require('biz/plugin.js').admin;
var plugin = bizplugin.getPluginByName('addtwiter');
print(plugin.code);
