'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');

const strings = require('./strings');

var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

const ACTION = {
    SPORTS: 'action_sports',
    PRODUCT: 'action_product',
    ORDER_66: 'action_order66',
    WELCOME: 'input.welcome',
    UNKNOWN: 'input.unknown',
    DEFAULT: 'default'
    //TEMPLATE: 'acion.template'
};

const ARGUMENT = {
    SPORTS: 'entitySports',
    PRODUCT: 'entity_product',
    ORDER66: 'entityOrder66'
};

const CONTEXT = {
    SPORTS: 'intent_sports'
};

const askSports = app => {
    let argumentSports = app.getArgument(ARGUMENT.SPORTS);
    let responseToUser = app.buildRichResponse().addSimpleResponse({
        speech: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you.',
        displayText: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you.'
    });
    console.log('Response to Dialogflow (AoG): ' + JSON.stringify(responseToUser));
    app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
};

const askProduct = app => {
    let argumentSports = app.getContextArgument(CONTEXT.SPORTS, ARGUMENT.SPORTS);
    let argumentProduct = app.getArgument(ARGUMENT.PRODUCT);
    let responseToUser = app.buildRichResponse().addSimpleResponse({
        speech: 'You\'re welcome! Here are some ' + argumentSports.value + ' ' + argumentProduct + ' for you!',
        displayText: 'You\'re welcome! Here are some ' + argumentSports.value + ' ' + argumentProduct + ' for you!'
    });
    console.log('Response to Dialogflow (AoG): ' + JSON.stringify(responseToUser));
    app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
};

const askOrder66 = app => {
    let responseToUser;
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        responseToUser = app.buildRichResponse()
            .addSimpleResponse({
                speech: 'Yes, My Lord! ',
                displayText: 'Yes, My Lord! (with screen)'
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
};

const askWelcome = app => {
    app.ask('Hello, Welcome to my Dialogflow agent! Deployed on Google Firebase Functions'); // Send simple response to user
};

const askUnknown = app => {
    app.ask('I\'m having trouble, can you try that again? Deployed on Google Firebase Functions'); // Send simple response to user
};

const askDefault = app => {
    let responseToUser = {
        //googleRichResponse: googleRichResponse, // Optional, uncomment to enable
        //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
        speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
        text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
    };
    app.ask(responseToUser);
};

//const templateFunction = app => {
    // ...
//};

const actionMap = new Map();
actionMap.set(ACTION.SPORTS, askSports);
actionMap.set(ACTION.PRODUCT, askProduct);
actionMap.set(ACTION.ORDER_66, askOrder66);
actionMap.set(ACTION.UNKNOWN, askUnknown);
actionMap.set(ACTION.WELCOME, askWelcome);
actionMap.set(ACTION.DEFAULT, askDefault);
//actionMap.set(ACTION.TEMPLATE, templateFunction);

const dazzlerbot = functions.https.onRequest((request, response) => {
    const app = new DialogflowApp({ request, response });
    console.log(`Request headers: ${JSON.stringify(request.headers)}`);
    console.log(`Request body: ${JSON.stringify(request.body)}`);
    app.handleRequest(actionMap);
});

module.exports = {
    dazzlerbot
};