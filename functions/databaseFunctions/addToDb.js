'use strict';

const { DialogflowApp } = require('actions-on-google');
const bodyParser = require('body-parser');
const strings = require('./strings');

process.env.DEBUG = 'actions-on-google:*';


const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

/***__Elemente erstellen__**/
var docRef = db.collection('shoes').doc('BARRICADE');

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