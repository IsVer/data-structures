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

    // var collection = db.collection(collectionName);

    // collection.aggregate( [

    //     { $unwind : "$meetingList" },
        
    //     { $match : { "meetingList.day" : "Tuesdays" } },
        
    //     { $group : {  _id : { 
    //         meetingName : "$meetingName",
    //         meetingHouse : "$meetingHouse",
    //         meetingAddress1 : "$meetingAddress1",
    //         meetingAddress2 : "$meetingAddress2",
    //         meetingDetails : "$meetingDetails",
    //         meetingWheelchair : "$meetingWheelchair",
    //         latLong : "$latLong"
    //     }, 
    //         meetingDay : { $push : "$meetingList.day" },
    //         startTime : { $push : "$meetingList.startTime" },
    //         startTimeHour : { $push : "$meetingList.startTimeHour" },
    //         endTime : { $push : "$meetingList.endTime" },
    //         meetingType : { $push : "$meetingList.meetingType" },
    //         specialInterest : { $push : "$meetingList.specialInterest" }
    //     }},
        
    //     { $group : { _id : { latLong : "$_id.latLong" }, 
    //                 meetingGroups : { $addToSet : {  meetingGroup : "$_id", 
    //                                             meetings : {
    //                                             meetingDays : "$meetingDay",
    //                                             startTimes : "$startTime",
    //                                             startTimeHours : "$startTimeHour",
    //                                             endTimes : "$endTime",
    //                                             meetingTypes : "$meetingType",
    //                                             specialInterest : "$specialInterest"
    //                                             }
    //                 } }
    //                 } }
        
    //      ]).toArray(function(err, docs) {
    //     if (err) {console.log(err);}
    //     else {
    //         // console.log(JSON.stringify(docs));
    //         for (var i=0; i < docs.length; i++) {
    //             console.log(JSON.stringify(docs[i], null, 4));
    //             console.log('db in the making');
    //         }
    
var stations = db.collection('stations');
var forWindow = db.collection('forWindow');

// for (var i=0; i < stations.length; i++) {
//             console.log(stations[i]);
//           stations.insert(stations[i]);
//             }
//         db.close();
        
for (var key in forWindow) {
            console.log(forWindow.key);
            forWindow.insert(forWindow.key);
            }
        db.close();
    }); //MongoClient.connect
