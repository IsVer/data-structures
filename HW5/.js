//// -- preperation -- ////

// Modules:
var fs = require('fs');
var async = require('async'); // npm install --save async
var request = require('request'); // npm install request
var cheerio = require('cheerio'); // npm install cheerio

// Defining variables:prin
var apiKey = "AIzaSyDZ7BHWLGzI70haENQXZXMz22YLHrcM1ow"; //process.env.GMKEY;
var meetings = []; //meetings array
var LatLongAddresses = [];
var mapAddresses = [];

// Function 'to24hour' to change the 12h clock to 24h:
function to24hour(time) {
    var comps = time.split(' ');
    var tm = comps[0]; //5:40
    var pm = comps[1]; //pm
    var hours = tm.split(':')[0];
    var minutes = tm.split(':')[1];
    var isPm = pm === 'PM';
    if (hours == '12' && !isPm) {
        return '00:' + minutes;
    }
    var totalHours = Number(hours) + (isPm ? 12 : 0);
    return (totalHours + ':' + minutes);
}
console.log("To test: time in 24 hour format is " + to24hour('5:30 PM')); //testing


//// -- long function -- ////

// For loop to read all the scraped txt files, in preperation to be cleaned:
for (var i = 1; i<=10; i++) {

    var fileNumber = i < 10 ? '0' + i : 10;
    var filePath = '/home/ubuntu/workspace/HW1/texts/m' + fileNumber + '.txt';
    console.log(filePath);
    var file = fs.readFileSync(filePath);
    var $ = cheerio.load(file); //so js can "read" html text in 'm01.txt' file


///// ---- Scrape function 'select' ---- /////
    // 1. In each file: select the table 'tbody' and run the script through every row 'tr'$('tbody').find('tr').each(function(i, elem) {
    // function select(content) {
    $('div table tbody tr').each(function (i, elem) {

        // 2. Put row items about meetings in new object:
        var meeting = new Object;
        // 3. Defining properties in meeting object:
        meeting.name = $(elem).find('td').find('b').eq(0).text().trim();

        function cleanName(name) { //cleaning
            return meeting.name.split(' -')[0].replace("(:II)", "").replace("(:I)", "").replace("(:1)", "").replace("(I)", "").trim();
        }

        meeting.name = cleanName(meeting.name);
        //console.log(meeting.name);
        var td = $(elem).find('td');
        var tdText = td.text();
        meeting.address = $(elem).find('td').first().html().split('<br>')[2]
            .replace('W.', 'West').replace('E.', 'East').split(',')[0].concat(', New York, NY')
            .split(' ').join('+').trim();
        mapAddresses.push(meeting.address); //for google maps later
        //console.log(meeting.address);
        meeting.locations = td.find('h4').text().split('\n')[0].trim();
        // console.log(meeting.locations)

        meeting.days = $(td[1]).text().trim().split(' ')[0];
        //console.log(meeting.days);

        meeting.start = to24hour(tdText.split('From')[1].split('to')[0].trim());
        meeting.end = to24hour(tdText.split('From')[1].split('to')[1].split('Meeting Type')[0].trim());

        if (tdText.split('Meeting Type').length > 1) {
            meeting.type = tdText.split('Meeting Type')[1].split('=')[0].trim();
        }
        // if (tdText.indexOf('Special Interest') > 1) {
        //     meeting.specialInterest = tdText.split('Special Interest')[1].split (' ')[0].trim();
        // }

        // if(times[j].indexOf("Special Interest") !== -1 ){
        //         meeting.interest = times[j].split('Special Interest')[1].trim();
        //

        meetings.push(meeting);
    });

    //4. Push meeting object into meetings array
    console.log(meetings);
    //Write the meetings data to results.txt
    fs.writeFileSync('/home/ubuntu/workspace/HW5/cleanded_m' + fileNumber + '.txt', JSON.stringify(meetings));


//// ---- Google Maps api ---- ////
// var getGeo = function() {
//     console.log('Requesting LatLong from Google maps API ... ');
//     var geodata = null;




async.eachSeries(mapAddresses, 
        function (value, callback) {
        var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey;
        var thisMeeting = new Object;
        thisMeeting.address = value;
        request(apiRequest, function (error, resp, body) {
            if (error) {throw error;}
            // Assign latLong data to current meeting object
            var pars = JSON.parse(body);
            if (pars.results.length > 0) {
                var geom = pars.results[0].geometry;
                thisMeeting.latLong = geom.location;
                thisMeeting.address = thisMeeting.address.split('+').join(' ');
                LatLongAddresses.push(thisMeeting);
            }else {
                console.log(pars);
            }
            });
        setTimeout(callback, 2000);
    },
    function () {
        console.log(LatLongAddresses);
     ///write results in json file
     fs.writeFileSync('/home/ubuntu/workspace/HW5/LatLong_Output.txt', JSON.stringify(LatLongAddresses));
   
    });
}



    