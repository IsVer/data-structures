var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
request('http://visualizedata.github.io/datastructures/data/m01.html', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
  }
});