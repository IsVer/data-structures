var datetimeStart = new Date();

var dbName = 'locations';
var collName = 'meetings';
var url = 'mongodb://localhost:27017/alcAn'; // Connection URL
var MongoClient = require('mongodb').MongoClient; // Retrieve

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}
    
    var collection = db.collection(collName);
    // var moreUptown = [];
    
    // collection.find({lat: {$gt: 40.71}}).toArray(function(err, meetings) {
    //  if (err) {console.log(error)} 
    //   else
    //       {moreUptown.push(meetings)
    //   };

//Limiting the number of documents passed to the next stage in the pipeline:
    collection.aggregate([{ $limit : 2 }]).toArray(function(err, db) {
        if (err) {console.log(err)}
          // two objects in $limit
        else {
            console.log("meetings");
        }
        
        db.close();
        console.log("This process completed in", new Date() - datetimeStart, "milliseconds.");
    });
})
     // MongoClient connect will be the last thing to finish.