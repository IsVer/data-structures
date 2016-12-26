var fs  = require('fs');
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

var stations = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/HW5/ObjectForGoogle.txt', 'utf8'));
var forWindow = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/HW5/fullMeetings.txt', 'utf8'));

// for (key in dataToInsert) {
// dataToInsert.windowText = 

var dbName = "AAlocations";
var url = "mongodb://localhost:27017/" + dbName;


MongoClient.connect(url, function(err, db) {
    if (err) {
        return console.dir(err);
    }

    var Stations = db.collection('stations');
    
    for (var i=0; i < stations.length; i++) {
        console.log(stations[i]);
        Stations.insert(stations[i]);
    }
    db.close();
}); //MongoClient.connect
