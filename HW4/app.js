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

var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};