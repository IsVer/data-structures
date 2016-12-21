var express = require('express')
var app = express()
var https = require('https')
var fs = require('fs')
var cors = require('cors');
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app = express();
app.use(cors());

    
/*
This server loads data from mongo and returns it through /meetings
*/

var getMeetingsFromMongo = function(onComplete) {
    // Rretrieve data from Mongo
    var dbName = 'AAlocations';
    var collName = 'stations';
    
    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;
    
    //lets require/import the mongodb native drivers.
    var mongodb = require('mongodb');
    
    //We need to work with "MongoClient" interface in order to connect to a mongodb server.
    var MongoClient = mongodb.MongoClient;
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        
        var collection = db.collection('stations');
        
        collection.find().toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Found:', result);
          } else {
            console.log('No document(s) found with defined "find" criteria!');
          }
          //Close connection
          db.close();
          onComplete(result);
        });
        
      }
    });
}

app.get('/', function (req, res) {
    console.log('GET: /')
    res.send('Hello World!')
})

app.get('/meetings', function(req, res) {
    console.log('GET: /meetings')
    getMeetingsFromMongo(function(results) {
      res.send(results)
    })
})

//app.listen(process.env.PORT, process.env.IP);
// https.createServer({
//     key: fs.readFileSync('/home/ubuntu/workspace/HW5/server.key'),
//     cert: fs.readFileSync('/home/ubuntu/workspace/HW5/server.crt'),
//     ca: fs.readFileSync('/home/ubuntu/workspace/HW5/ca.crt')
// }, app).listen(process.env.PORT, process.env.IP, function() {
//     console.log("Secure Express server listening on port" + process.env.PORT + process.env.IP);
// });
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Secure Express server listening on port" + process.env.PORT + process.env.IP);
})