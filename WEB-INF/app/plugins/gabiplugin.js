
var sizzle = require("sizzle").sizzle;

var plugin = {
    render: function(context,env){
        if(env.url && env.url.indexOf('wewe')!=-1){
            print('interested');
        } else {
            var $ = sizzle(env.document);
            var div1 = env.document.createElement('div');
            div1.innerHTML='gabi plugin';
            if($("div#content").length>0)
                $("div#content")[0].appendChild(div1);
        }
    }
};

export('plugin');
exports.version = '0.0.1';
exports.author = 'jassux';
exports.email = 'example@domain.com';
exports.activatedByDefault = false;