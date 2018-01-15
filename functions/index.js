'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
const body_parser = require('body-parser');

//const strings = require('./strings');

var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

//process.env.DEBUG = 'actions-on-google:*';


const dazzlerbot = functions.https.onRequest((request, response) => {

    const app = new DialogflowApp({ request: request, response: response });

    /* List of Actions */
    const ACTION = {
        SPORTS: 'action.Sports',
        PRODUCT_SEARCH: 'action.ProductSearch',
        ORDER_66: 'action.Order66',
        WELCOME: 'input.welcome',
        UNKNOWN: 'input.unknown',
        DEFAULT: 'default'
    };

    console.log(`Request headers: ${JSON.stringify(request.headers)}`);
    console.log(`Request body: ${JSON.stringify(request.body)}`);
    
    let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
    
    function askSports (app) {
        let parametersParsed = parameters.body_parser.JSON();
        let responseToUser = app.buildRichResponse().addSimpleResponse({
            speech: 'schorsch speech' + parametersParsed,
            displayText: 'schorsch text' + parametersParsed
        });
        console.log('Response to Dialogflow (AoG): ' + JSON.stringify(responseToUser));
        app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
    }

    function askOrder66 (app) {
        let responseToUser;
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            responseToUser = app.buildRichResponse()
                .addSimpleResponse({
                    speech: 'Yes, My Lord! ',
                    displayText: 'Yes, My Lord! with mobile phone'
                })
                .addBasicCard(app.buildBasicCard('UnterschriftUnterDemBild')
                    .setImage(
                    'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                    'TextNebenDemBild'
                    )
                )
        } else {
            responseToUser = ('Yes, My Lord!');
        }
        app.ask(responseToUser); // Send simple response to user
    }

    function askProduct (app) {
        let responseToUser = app.buildRichResponse().addSimpleResponse({
            speech: 'schorsch speech',
            displayText: 'schorsch text'
        });
        console.log('Response to Dialogflow (AoG): ' + JSON.stringify(responseToUser));
        app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
    }

    function askWelcome (app) {
        app.ask('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
    }

    function askUnknown (app) {
        app.ask('I\'m having trouble, can you try that again?'); // Send simple response to user
    }

    function askDefault (app) {
        let responseToUser = {
            //googleRichResponse: googleRichResponse, // Optional, uncomment to enable
            //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
            speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
            text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        app.ask(responseToUser);
    }

    /* Actions */
    const actionMap = new Map();
    actionMap.set(ACTION.PRODUCT_SEARCH, askProduct);
    actionMap.set(ACTION.SPORTS, askSports);
    actionMap.set(ACTION.ORDER_66, askOrder66);
    actionMap.set(ACTION.UNKNOWN, askUnknown);
    actionMap.set(ACTION.WELCOME, askWelcome);
    actionMap.set(ACTION.DEFAULT, askDefault);
    app.handleRequest(actionMap);
});