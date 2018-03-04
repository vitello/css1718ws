'use strict';

const { DialogflowApp } = require('actions-on-google');
const bodyParser = require('body-parser');
const strings = require('./strings');

process.env.DEBUG = 'actions-on-google:*';


const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();


function deleteDocument(db) {
    // [START delete_document]
    var deleteDoc = db.collection('shoes').doc('BARRICADE').delete();
    // [END delete_document]

    return deleteDoc.then(res => {
        console.log('Delete: ', res);
    });
}
//deleteDocument(db);