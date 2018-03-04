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

/**
 * Function to add new documents to database
 * uncomment setDocument(db) at the end to activate
 * 
 */
function setDocument(db) {
    // [START set_document]
    var data = {
        name: 'I-5923',
		color: 'red',
		type: 'shoe',
		img: 'https://firebasestorage.googleapis.com/v0/b/dazzlerbot.appspot.com/o/AdidasProdukte%2Fshoes%2Foriginals%2Foriginals_r.jpg?alt=media&token=c732693d-6b19-47e5-b1f3-03094c22d305',
		link: 'https://www.adidas.de/i-5923-schuh/B42225.html'
    };
    // Add a new document in collection "cities" with ID 'LA'
    var setDoc = db.collection('originals').doc('oshoe_red').set(data);
    // [END set_document]

    return setDoc.then(res => {
        console.log('Set: ', res);
    });
}
//setDocument(db);

/**
 * For Documentation of the entries that are in the database 
 * already look at the file in dropbox
 */
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

function buildOptionItem(app, aString) {
    // Provide a key which is unique to each option.
    // And synonyms that the user can say alternativly to the title
    return app.buildOptionItem(`KEY_${aString}`, aString)
        .setTitle(`Option ${aString}`)
        // Description and image are optional.
        .setDescription(`Description for ${aString}`)
        .setImage('https://example.com/image.jpg', 'An image')
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
        //Container zum Speichern der abgerufenen Daten
        let img = [];
        let link = [];
        let color = [];
        let name = [];
        
        var collectionRef = db.collection(argumentSports.value);
        

        //zunächst probieren die Daten nur für ein Dokument auszulesen
       
        var query = collectionRef.where('type', '==', argumentProduct);
        

        query.get().then(
            /* Hier Operationen auf den Daten ausführen */
            function(results) {
                if(results.empty) {
                    responseToUser = app.buildRichResponse()
                    .addSimpleResponse({
                        speech: 'I am sorry, I can not find this product. Please try another one or restart the service.',
                        displayText: 'I am sorry, I can not find this product. Please try another one or restart the service.'
                    })
                    console.log("Product Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
                    app.ask(responseToUser);
                    //console.log("Error getting documents:", error);   
                } else {  
                    // go through all results

                    let carousel = app.buildCarousel();

                    results.forEach(
                        function (doc) {
                        console.log("Document data:", doc.data());
                            carousel.addItems(
                                app.buildOptionItem(`KEY_${doc.data().link}`,doc.data().link)
                                .setTitle(doc.data().name)
                                .setDescription(doc.data().link)
                                .setImage(doc.data().img, 'image')
                            );
                        }
                    );
                    
                    console.log("Build response");
                    app.askWithCarousel('Alright! Here are some products for you!', carousel);
                                   
                    /*const app = new ActionsSdkApp({request, response});
                    let actionMap = new Map();
                    actionMap.set(app.StandardIntents.OPTION, () => {
                    const param = app.getSelectedOption();
                    if (!param) {
                        app.ask('You did not select any item from the list or carousel');
                    } else if (param === 'MATH_AND_PRIME') {
                        app.ask('42 is an abundant number because the sum of its…');
                    } else if (param === 'EGYPT') {
                        app.ask('42 gods who ruled on the fate of the dead in the...');
                    } else if (param === 'RECIPES') {
                        app.ask('Here\'s a beautifully simple recipe that\'s full...');
                    } else {
                        app.ask('You selected an unknown item from the list or carousel');
                    }
                    });
                    app.handleRequest(actionMap);
                    */
                    //console.log("Product Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
                    //app.ask(responseToUser);
                }
            }
        ).catch(function(error) {
            /*
                HIER CLIENTNACHRICHT EINBAUEN
            */  
            responseToUser = app.buildRichResponse()
            .addSimpleResponse({
                speech: 'I am sorry, I can not fin this product. Please try another one or restart the service.',
                displayText: 'I am sorry, I can not fin this product. Please try another one or restart the service.'
            })
            console.log("Product Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
            app.ask(responseToUser);
            //console.log("Error getting documents:", error);
        });
        
          
    } else {
        responseToUser = ('That is nice, if you ask me that on a screen based device again, I can show you some pictures');      
        console.log("Response to Dialogflow (AoG): " + JSON.stringify(responseToUser));
        app.ask(responseToUser);   
    }
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
