'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');

const strings = require('./strings');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

let db = admin.firestore();

/*****************************************FUNCTIONS**********************************************************************/
/*
* Function to handle v2 webhook requests from Dialogflow
* used if you work with data from our database
*/
function deleteDocument(db) {
    // [START delete_document]
    var deleteDoc = db.collection('shoes').doc('BARRICADE').delete();
    // [END delete_document]

    return deleteDoc.then(res => {
        console.log('Delete: ', res);
    });
}
//deleteDocument(db);
function setDocument(db) {
    // [START set_document]
    var data = {
        name: 'Barricade tennis',
        color: 'red',
        sport: 'tennis',
        img: 'USA'
    };
    var data2 = {
        name: 'Barricade football',
        color: 'red',
        sport: 'football',
        img: 'USA'
    };
    var data3 = {
        name: 'Barricade golf',
        color: 'red',
        sport: 'golf',
        img: 'USA'
    };
    // Add a new document in collection "cities" with ID 'LA'
    var setDoc = db.collection('shoes').doc('BARRIGOLF').set(data3);
    // [END set_document]

    return setDoc.then(res => {
        console.log('Set: ', res);
    });
}

function getDocument(db) {
    // [START get_document]
    var cityRef = db.collection("shoes").doc("BARRICADE");
    var getDoc = cityRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log("No such document!");
            } else {
                console.log("Document data:", doc.data());
            }
        })
        .catch(err => {
            console.log("Error getting document bla", err);
        });
    // [END get_document]

    return getDoc;
}

/******************************************ACTIONS_ON_GOOGLE*************************************************************/
const ACTION = {//Refers ti Intents --> Action
    SPORTS: 'action_sports',
    PRODUCT: 'action_product',
    ORDER_66: 'action_order66',
    WELCOME: 'input.welcome',
    UNKNOWN: 'input.unknown',
    DEFAULT: 'default'
    //TEMPLATE: 'acion.template'
};

const ARGUMENT = {//refers to Entities
    SPORTS: 'entity_sports',
    PRODUCT: 'entity_product',
    ORDER66: 'entityOrder66'
};

const CONTEXT = {
    SPORTS: 'intent_sports'
};

const askSports = app => {
    let argumentSports = app.getArgument(ARGUMENT.SPORTS);
    let responseToUser = app.buildRichResponse().addSimpleResponse({
        speech: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you. Which product do you need for your inventory?',
        displayText: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you. Which product do you need for your inventory?'
    });
    console.log("Sport Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
    app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
};

const askProduct = app => {
    let argumentSports = app.getContextArgument(CONTEXT.SPORTS, ARGUMENT.SPORTS);
    console.log(argumentSports.value);   
    let argumentProduct = app.getArgument(ARGUMENT.PRODUCT);
    console.log(argumentProduct);   
    let responseToUser;
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        let array = [];

        var collectionRef = db.collection(argumentProduct);
        //zunächst probieren die Daten nur für ein Dokument auszulesen
        var query = collectionRef.where('sport', '==', argumentSports.value);

        query.get().then(function(results) {
            if(results.empty) {
              console.log("No documents found!");   
            } else {
                console.log("in else");  
              // go through all results
              results.forEach(function (doc) {
                console.log("Document data2:", doc.data());
                array.push(doc.data().name);
              });
              var prodpic = array[0];
              console.log(prodpic);
              /* Dank der asynchronität muss hier alles geschehen, wofür die Daten aus der Datenbank genommen werden
              da diese bei fortschreiten des PRogrammes dann noch nicht vorhanden sein werden?! Macht wenig Sinn, ist aber leider so */
              responseToUser = app.buildRichResponse()
              .addSimpleResponse({
                  speech: 'You\'re welcome! Here are some ' + prodpic + ' ' +  argumentSports.value + ' ' + argumentProduct + ' for you!',
                  displayText: 'You\'re welcome! Here are some ' + argumentSports.value + ' ' + argumentProduct + ' for you!'
              });

              
              console.log("Product Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
          
              app.ask(responseToUser);
            


            }
          }).catch(function(error) {
              console.log("Error getting documents:", error);
          });




          
    } else {
        responseToUser = ('That is nice, if you ask me that on a screen based device again, I can show you some pictures');
        
        console.log("Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
    
        app.ask(responseToUser);
        
    }
  
      //.addBasicCard(app.buildBasicCard('UnterschriftUnterDemBild')
        //  .setImage(prodpic,'nice')
      //)

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
                    /*variable aufgreifen, welche die Spportart enth�lt und
                    per SQL den Pfad zu einem passenden Produkt aus der DB holen*/
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
    app.ask('Hello, Welcome to the Dazzler shopping agent! Which sport activity do you practice?'); // Send simple response to user
};

const askUnknown = app => {
    app.ask('I\'m having trouble, can you try that again?'); // Send simple response to user
    callback(null, responseJson);
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
