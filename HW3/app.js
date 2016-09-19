var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio
var request = require('request'); // npm install request
var async = require('async'); // npm install async

var content = fs.readFileSync('/home/ubuntu/workspace/HWs/data-structures/HW2/m01.txt');
var meetings = [];

var $ = cheerio.load(content);
//$(window).on('load', function() { ... });
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
fs.writeFileSync('/home/ubuntu/workspace/HWs/data-structures/HW2/meetingArray.txt', JSON.stringify(meetings));

meetings = ["20 Cardinal Hayes Place, Rectory Basement,","20 Cardinal Hayes Place, Enter through driveway behind Church.,","29 Mott Street, Basement,","49 Fulton Street, 1st Floor Library,","44 John Street,","49 Fulton Street,","20 Cardinal Hayes Place, Enter thru driveway behind Church.,","22 Barclay Street,","20 Cardinal Hayes Place, Enter thru driveway behind Church.,","22 Barclay Street (Basement),","283 West Broadway,","125 Barclay Street,","49 Fulton Street, Conference Room #1,","49 Fulton Street,","20 Cardinal Hayes Place, \r\n\t\t\t\t\t\t10007","283 West Broadway,","49 Fulton Street,","22 Barclay Street- basement chapel,","20 Cardinal Hayes Place,","283 West Broadway, \r\n\t\t\t\t\t\t10013","283 West Broadway,","283 W. Broadway,"];


function cleaningStreets(array) {
    for (var i=0; i < meetings.length; i++) {
        var streetName = 'i';
        var streetName1 = streetName.substring(0, streetName.indexOf(','));
        var streetName3 = streetName1 + ', New York, NY';
        var streetName4 = streetName3.split(" ").join('+');
        meetings.push(streetName4);
    }
    console.log(meetings);
}

cleaningStreets(meetings);


// var apiKey = process.env.GMAKEY;

// var meetingsData = [];
// var addresses = ["63 Fifth Ave, New York, NY", "16 E 16th St, New York, NY", "2 W 13th St, New York, NY"];

// // eachSeries in the async module iterates over an array and operates on each item in the array in series
// async.eachSeries(addresses, function(value, callback) {
//     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
//     var thisMeeting = new Object;
//     thisMeeting.address = value;
//     request(apiRequest, function(err, resp, body) {
//         if (err) {throw err;}
//         thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
//         meetingsData.push(thisMeeting);
//     });
//     setTimeout(callback, 2000);
// }, function() {
//     console.log(meetingsData);
// });


// //var streetName = '50 Perry Street, Ground Floor,';
// //var streetName1 = streetName.substring(0, streetName.indexOf(','));
// //var streetName3 = streetName1 + ', New York, NY';
// // var streetName4 = streetName3.split(' ').join('+');
// // console.log(streetName4);