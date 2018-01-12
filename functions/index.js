'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');

var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.dazzlerbot = functions.https.onRequest((req, res) => {
    const app = new DialogflowApp({request: req, response: res});  
    
    function askShoe (app){
        app.ask('hello world');
    }

    function executeOrder66 (app){
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)){
            app.tell(app.buildRichResponse() 
                .addSimpleResponse('Yes, My Lord! with mobile phone')           
                .addBasicCard(
                     app.buildBasicCard('test')
                        .setImage(
                            'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                            'alttext'
                        )
                )             
            );
        } else {
            app.tell('Yes, My Lord!');
        }
    }

    let actionMap = new Map();
    actionMap.set('actionShoe', askShoe);
    actionMap.set('actionOrder66', executeOrder66);
    app.handleRequest(actionMap);
});