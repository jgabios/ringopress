var defaultAction = require('lib/RingoPressAction');
var MT = require('mootools-core-1.3-server.js');
var CONSTANTS = require('constants');

var TestEmailAction = new MT.Class({
    Extends: defaultAction.ringopressaction,
    initialize: function(){
        this.parent();
        this.skin="skins/index.html";
    },
    getContext: function(req,url){
         var EmailMessage = require("mail").EmailMessage;

    new EmailMessage({
        sender: "from@gmail.com",
        to: "to@gmail.com",
        subject: "My email test",
        body: 'test'
    }).send();
    return {};
    }
});

var testemail =  new TestEmailAction();
exports.testemail = testemail.process.bind(testemail);
