//Scheinbar nicht mehr unterstützt für die Verwendung mit node.js
//--> download link der in der Datenbank gespeicher ist verwenden

const storage = admin.storage();//reference to storage service
var storageRef = storage.ref();//reference to storage

var gsReference = storage.refFromURL('gs://dazzlerbot.appspot.com/BARRICADE_2018_BOOST_SCHUH_standard.jpg');