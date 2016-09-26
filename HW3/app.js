// imports
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

//load cherrio dom
var content = fs.readFileSync('/home/ubuntu/workspace/HWs/data-structures/HW2/m01.txt');
var meetings = [];
var $ = cheerio.load(content);
$('tbody').find('tr').each(function(i, tr){
    var td_array = $(tr).find('td');
    var el = td_array.eq(0); 
    var html = el.html();
    var html_parts = html.split('<br>');
    var third_br = html_parts[2];
    var addressWithoutWhiteSpace = third_br.trim(); 
    meetings.push(addressWithoutWhiteSpace);
    //meetings.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    });
console.log(meetings.length); // print number of meetings in meetings array


fs.writeFileSync('/home/ubuntu/workspace/HWs/data-structures/HW3/meetingArray1.txt', JSON.stringify(meetings));

var apiKey = process.env.GMA_KEY;
var meetingsData = [];
var addresses = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/HWs/data-structures/HW3/meetingArray1.txt'));


function cleanAddress(address) {
    var newAddress = address.substring(0, address.indexOf(',')) + ', New York, NY';
    return newAddress;
}

var cleanAddresses = [];
addresses.forEach(function(address) {
    var clean = cleanAddress(address);
    
    //remove duplicates
    if (cleanAddresses.indexOf(clean) === -1) {
        cleanAddresses.push(clean)
    }
});

console.log('Count of cleaned addresses: ' + cleanAddresses.length)


//query google api for lat/long for each address
async.eachSeries(cleanAddresses, function(address, callback) {
    
    console.log('formatting request for ' + address);
    //create the api request
    var apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address.split(' ').join('+') + '&key=' + apiKey;

    //create thisMeeting variable to store the lat/long of each meeting address
    var thisMeeting = new Object;
    thisMeeting.address = address;

    //wait 2 seconds
    console.log('waiting 2 seconds...');
    setTimeout(function() {
        
        //make api request
        console.log('requesting ' + apiUrl);
        request(apiUrl, function(err, resp, body) {
            //error in request
            if (err) {
                throw err;
            }
            
            //parse json once
            var json = JSON.parse(body)
            
            //if google has results
            var hasResults = json.status != 'ZERO_RESULTS'; 
            if (hasResults) {
                //get location of meeting
                thisMeeting.latLong = json.results[0].geometry.location;
                //track location of meeting
                meetingsData.push(thisMeeting);
                
            }else {
                //log failed request
                console.log(apiUrl + ' has zero results');
            }
            
            //when api is done, go to next item in cleanAddresses
            //if this doesn't happen here, it will be out of sync
            console.log('going to next item in addresses' + '\n\n');
            callback();
        });
        
    }, 2 * 1000);

    }, 
    
    function() {
        fs.writeFileSync('/home/ubuntu/workspace/HWs/data-structures/HW3/meetingArray1.txt', JSON.stringify(meetingsData));
});