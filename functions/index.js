'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');

const strings = require('./strings');

var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

const Actions = {
    UNRECOGNIZED_DEEP_LINK: 'deeplink.unknown',
    ACTION_SHOE: 'actionShoe',
    ACTION_ORDER_66: 'actionOrder66'
  };
//   /** Dialogflow Parameters {@link https://dialogflow.com/docs/actions-and-parameters#parameters} */
//   const Parameters = {
//     CATEGORY: 'category'
//   };
//   /** Dialogflow Contexts {@link https://dialogflow.com/docs/contexts} */
//   const Contexts = {
//     FACTS: 'choose_fact-followup',
//     CATS: 'choose_cats-followup'
//   };
//   /** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */
//   const Lifespans = {
//     DEFAULT: 5,
//     END: 0
//   };  

/* App: Shoes */
const askShoe = app => {
    app.ask('hello world');
}

/* App: Order66 */
const executeOrder66 = app => {
    var richResponse = app.buildRichResponse()
        .addSimpleResponse('Yes, My Lord! with mobile phone')           
        .addBasicCard(app.buildBasicCard('test')
            .setImage(
                'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                'alttext'
            )
        )
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        app.tell(richResponse);
    } else {
        app.tell('Yes, My Lord!');
    }
}

/* Actions */
const actionMap = new Map();
//actionMap.set(Actions.UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
actionMap.set(Actions.ACTION_SHOE, askShoe);
actionMap.set(Actions.ACTION_ORDER_66, executeOrder66);

/* Main App */
const dazzlerbot = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({ request, response });
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  app.handleRequest(actionMap);
});

/* Export Main App */
module.exports = {
    dazzlerbot
};
