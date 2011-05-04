
/**
 * @fileOverview provides {@link action} function that is used
 * in all actions throughout the site.
 * settings and defaultContext, that all actions use, are declared and initialized
 * 
 */

var {Response} = require('ringo/webapp/response');
var Skin = require('ringo/skin');
var CONSTANTS = require('constants');
var ObjectUtil = require('ringo/utils/objects');
var HTMLParser = require("htmlparser").HTMLParser;
/**
 * settings is a variable used in any action that needs access to global constants
 * for now, we hold in it the pluginManager and the themeFolder
 */
var settings = {
    "themeFolder": "skins/"+CONSTANTS.THEME_FOLDER+"/",
    "pluginManager": require('pluginManager')
}

/**
 * defaultContext is a variable that produces a context for all skins
 * used in ringopress. All common variables that are present in all pages go here.
 */
var defaultContext = {
    page: {
        title: CONSTANTS.BLOG_TITLE
    },
    blog: {
        name: CONSTANTS.BLOG_NAME,
        description: CONSTANTS.BLOG_DESCRIPTION
    }
};

/**
 * @param config - it is an object that has 2 items: a skin file and a function
 *                  that returns a context object
 * @return a function that acts as an action
 * 
 * action function is meant to be used in an action file, to reduce code
 * and have a central place where defaultContext can be passed to the skin,
 * where render plugins can be called, response status can be handled and so on.
 * 
 * Internally, it creates an object env [Environment] that is passed to the context
 * in order for the actual action to have access to the environment [request, response, settings]
 *
 *
 */
exports.action = function(config){
    var skin = settings.themeFolder+config.skin;
    var html;
    return function(req,url){
        var initialContext = ObjectUtil.clone(defaultContext);
        var resp = new Response();
        var env = {
            req: req,
            resp: resp,
            url: url,
            settings: settings
        }
        var context = ObjectUtil.merge(config.getContext(env),initialContext);

        if(!context.status){
            html = Skin.render(skin,context);
        } else {
            if(context.status=='redirect'){
                return Response.redirect(context.url);
            }
        }
	// this is for RSS feed page
        if(env.resp.contentType==='text/xml'){
            // do the same as below but with a XMLParser
	    // ---- right now, there is a problem with the HTMLParser used. we cannot use it to modify the dom and recnstruct it later
	    // maybe I will change it; we'll see
            env.resp.write(html);
            return resp;
        }
        var parser = new HTMLParser();
        var document = parser.parse(html);
        env.document = document;
        for(var plugin in settings.pluginManager.plugins){
            if(settings.pluginManager.plugins[plugin].activated){
              var renderFunction = settings.pluginManager.plugins[plugin].render;
              if(renderFunction && (renderFunction instanceof Function))
                  renderFunction(context,env);
            }
        }
        env.resp.write(env.document.toHTML());
        return resp;
    }
};
