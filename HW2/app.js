var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

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
fs.writeFileSync('/home/ubuntu/workspace/HWs/data-structures/HW2/meetingArray.txt', JSON.stringify(meetings));