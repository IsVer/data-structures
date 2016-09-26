var request = require('request');
request('https://raw.githubusercontent.com/IsVer/data-structures/master/HW3/meetingArray1.txt', function(error, response, body) {
    var locations = JSON.parse(body);

    // Connection URL to database
 var url = 'mongodb://localhost:27017/alcAn';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        var collection = db.collection('meetings');

    // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < locations.length; i++) {
            var meeting = locations[i];
            collection.insert(meeting);
            }
        db.close();

    }); //MongoClient.connect

}); //request
