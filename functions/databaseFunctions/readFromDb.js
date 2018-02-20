'use strict';

const { DialogflowApp } = require('actions-on-google');
const bodyParser = require('body-parser');
const strings = require('./strings');

process.env.DEBUG = 'actions-on-google:*';


const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

db.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
