'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const bodyParser = require('body-parser');

const strings = require('./strings');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';
/*******************************************__Storage Initialization__***************************************************//*

Scheinbar nicht mehr unterstützt für die Verwendung mit node.js
--> download link der in der Datenbank gespeicher ist verwenden

const storage = admin.storage();//reference to storage service
var storageRef = storage.ref();//reference to storage

var gsReference = storage.refFromURL('gs://dazzlerbot.appspot.com/BARRICADE_2018_BOOST_SCHUH_standard.jpg');

/******************************************Datenbankabfragen*************************************************************/

var db = admin.firestore();


/***__Elemente erstellen__**/
var docRef = db.collection('shoes').doc('BARRICADE');
/*
var setBAR = docRef.set({
    name: 'Barricade 2018',
    color: 'white',
    stripes: 'black',
    sport: 'tennis',
    img: 'https://firebasestorage.googleapis.com/v0/b/dazzlerbot.appspot.com/o/BARRICADE_2018_BOOST_SCHUH_standard.jpg?alt=media&token=c2b3b5f6-9677-47a1-bceb-e4c25c7d75d5'
});
var setBAR2 = docRef.set({
    name: 'Barricade 2018 Boost',
    color: 'blue',
    stripes: 'black',
    sport: 'football',
    img: 'https://firebasestorage.googleapis.com/v0/b/dazzlerbot.appspot.com/o/NOVAK_PRO_SCHUH_standard.jpg?alt=media&token=8263f55c-bffa-48f6-8e2e-57705b33cb61'
});

/***__Elemente abfragen__***//*
var getDoc = docRef.get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data())
        }
    })
    .catch(err =>{
        console.log('Error getting document', err);
    });




/***__Elemebte Löschen__***//*
var deleteDoc = db.collection('shoes').doc('BARRICADE').delete();

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
        speech: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you.',
        displayText: 'That\'s great, you want to practice ' + argumentSports + '! Our shop provides lots of nice things for you.'
    });
    console.log('Response to Dialogflow (AoG): ' + JSON.stringify(responseToUser));
    app.ask(responseToUser); // Send response to Dialogflow and Google Assistant
};

const askProduct = app => {
    let argumentSports = app.getContextArgument(CONTEXT.SPORTS, ARGUMENT.SPORTS);
    let argumentProduct = app.getArgument(ARGUMENT.PRODUCT);
    let responseToUser;
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {

        var productRef = db.collection('shoes');// db.collection(argument.product)
        var queryRef = productRef.where('sport', '==', 'tennis');//productRef.where('sport', '==', argument.sport);

        var prodpic; 

        /* Abfrage funktioniert noch nicht, wird richtig übersetzt, jedoch findet die app das Objekt nicht
        
        queryRef.on("value", function(snapshot){
                var imgsnap = snapshot.child("img");
                var img =imgsnap.val();
                prodpic = img;
            });
        */
        responseToUser = app.buildRichResponse()
            .addSimpleResponse({
                speech: 'You\'re welcome! Here are some '+ argumentSports.value + ' ' + argumentProduct + ' for you!',
                displayText: 'You\'re welcome! Here are some ' + argumentSports.value + ' ' + argumentProduct + ' for you!'
            })
            .addBasicCard(app.buildBasicCard('UnterschriftUnterDemBild')
                .setImage(prodpic,'nice')
            )
    } else {
        responseToUser = ('That is nice, if you ask me that on a screen based device again, I can show you some pictures');
    }

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
    app.ask('Hello, Welcome to my Dialogflow agent! Deployed on Google Firebase Armin Functions'); // Send simple response to user
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
