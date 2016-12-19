
// Modules:
var fs = require('fs');

var locations = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/HW5/LatLong_Output.txt', 'utf8'));

var addressMap = {};
for (var j in locations) {
    var locationJSON = locations[j];
    var address = locationJSON.address.split(' ').join('+');
    addressMap[address] = locationJSON.latLong;
}

var makeWindowTextFromMeetings = function(thingsAtThisAddress) {
    return "some long html text from all these objects";
}

var allMeetings = {};

// For loop to read all the scraped txt files, in preperation to be cleaned:
for (var i = 1; i<=10; i++) {

    var fileNumber = i < 10 ? '0' + i : 10;
    var filePath = '/home/ubuntu/workspace/HW5/cleanded_m' + fileNumber + '.txt';
    console.log(filePath);
    var meetings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (var m in meetings) {
        var meeting = meetings[m];
        meeting.latlon = addressMap[meeting.address];
        
        var groups = allMeetings[meeting.address];
        if (groups === undefined) {
            groups = [];
        }
        groups.push(meeting);
        allMeetings[meeting.address] = groups;
    }
}

var objectsForGoogle = [];
for (var address in allMeetings) {
    var eventsAtAddress = allMeetings[address];
    var windowText = makeWindowTextFromMeetings(eventsAtAddress);
    
    
    var newObjectForGoogle = {
        "address": address, "location": 
        eventsAtAddress[0].latlon, 
        "windowText": windowText}
    
    objectsForGoogle.push(newObjectForGoogle);
    
}

var writinglistForGoogle = function () {
     ///write results in json file
     fs.writeFileSync('/home/ubuntu/workspace/HW5/ObjectForGoogle.txt', JSON.stringify(objectsForGoogle));
    };
writinglistForGoogle();
