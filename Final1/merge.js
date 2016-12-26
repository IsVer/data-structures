
// Modules:
var fs = require('fs');
var async = require('async');

var locations = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/HW5/LatLong_Output.txt', 'utf8'));

var addressMap = {};
for (var j in locations) {
    var locationJSON = locations[j];
    var address = locationJSON.address.split(' ').join('+');
    addressMap[address] = locationJSON.latLong;
}

var filterOnDay = function(thingsAtThisAddress, currentDay) {
    var seenMeetings = {};
    var results = []
    
    for (var i=0; i < thingsAtThisAddress.length; i++) {
        var meeting = thingsAtThisAddress[i];
    
        //select only things for given day
        if (meeting.days == currentDay) {
            var meetingID = meeting.name + meeting.days + meeting.start;
            
            //remove duplicates
            if (seenMeetings[meetingID] == null) {
                seenMeetings[meetingID] = true;
                results.push(thingsAtThisAddress[i])
            }
            
        }
    }
    return results
};

var getNowDay = function() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] =  "Sundays";
    weekday[1] = "Mondays";
    weekday[2] = "Tuesdays";
    weekday[3] = "Wednesdays";
    weekday[4] = "Thursdays";
    weekday[5] = "Fridays";
    weekday[6] = "Saturdays";
    
    var n = weekday[d.getDay()];
    return n;
}

var translateMeetingType = function(meeting) {
    var abbreviations = {'OD': 'Open Discussion', 'B':'Beginners meeting', 'S': 'Step meeting', 'BB': 'Big Book meeting', 'C':'Closed Discussion'}
    meeting.type = abbreviations[meeting.type]
}

var makeWindowTextFromMeetings = function(thingsAtThisAddress) {
    var nowDay = getNowDay();
    thingsAtThisAddress = filterOnDay(thingsAtThisAddress, nowDay);
    
    if (thingsAtThisAddress.length == 0) {
        return 'Please check another day';
    }
    
    var windowText = ""; //1. create empty string    
    var address = thingsAtThisAddress[0].address.split('+').join(' ').trim();  //address 
    var location = thingsAtThisAddress[0].locations;//location
    var staticWindowText = address + "<br>" + "(" + location + ")";
    
    var flexWindowText = "";
    for (var i = 0; i < thingsAtThisAddress.length; i++) {
        var a = thingsAtThisAddress[i];
        translateMeetingType(a);
        
        var days = "<b>Meetings on " +  a.days + ":</b>"; 
        var name = '<h3 id="firstHeading" class="firstHeading">' + "Meeting: " + a.name  + '</h3>';
        var time = "<br>" + a.start + " - " + a.end + ": " +a.type+ "<br>";
        
        var fullMeetingInfo = name + days + time;

        flexWindowText += fullMeetingInfo;
            }
        // console.log(days);
        // console.log(info);
    windowText += staticWindowText + flexWindowText;
    return(windowText);
    };

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
console.log("writing file");
var writinglistForGoogle = function () {
     ///write results in json file
     fs.writeFileSync('/home/ubuntu/workspace/HW5/ObjectForGoogle.txt', JSON.stringify(objectsForGoogle));
    };
writinglistForGoogle();
console.log("file written");
