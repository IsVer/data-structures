var http = require('http');
var request = require('request');
request('http://visualizedata.github.io/datastructures/data/m10.html', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage. 
    }else {
        console.log(error)
    }
})

http.createServer(function (req, res) {
  
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World from Cloud9\n');
}).listen(process.env.PORT);
