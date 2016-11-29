//DOE: npm install pg
var fs = require('fs');
var pg = require('pg');
var http = require('http');
var ArduinoServer = require('./temp.js');


//start REST server
var server = http.createServer(function(req, res) {
    console.log('message received');
    handleDataRequest(req, res);
}); // server
server.listen(3000);
console.log('server started on port 3000');

// Start arduino server
startArduinoStream();


function handleDataRequest(req, res) {
    // establish pg connection - startercode
    var conString = generatePGConnectionURL();

    //client requested data so connect to database and return
    //all the data
    pg.connect(conString, function(err, client, done) {

        if (err) { return console.error('error fetching client from pool', err); }

        createTableIfNeeded(client, function(result){
            //table creation success

            //load all data from DB and return via json
            client.query('SELECT * from tempData', function(err, result) {
                done();

                if (err) {return console.error('error running query', err);}

                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify({'data': result.rows}));
                //
                // // write JSON file
                // fs.writeFileSync('sensorOutput.json', JSON.stringify(result.rows));

            });
        }, function(err) {
            //table creation failed
            console.log(err);

        });

    }); // pg.connect
}

function createTableIfNeeded(dbConnection, onSuccess, onFailure) {
    var createTableQuery = "CREATE TABLE IF NOT EXISTS tempData (dateCreated timestamp DEFAULT current_timestamp, celcius NUMERIC(10, 3), fahrenheit NUMERIC(10, 3), outsideTempCelcius NUMERIC, outsideTempFahrenheit NUMERIC, sleepQuality INTEGER);"

    dbConnection.query(createTableQuery, function(err, result) {
        err ? onFailure(err) : onSuccess(result);
    });
}

function generatePGConnectionURL() {
    var un = 'niemand'; // aws db username
    var pw = 'password'; // aws db password
    var db = 'thermo'; // aws db database name
    var ep = 'thermo.crfdjdjhtntf.us-east-1.rds.amazonaws.com:5432'; // aws db endpoint
    var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db; // 'postgres://someuser:somepassword@somehost:381/sometable'

    return conString;
}

function startArduinoStream() {
    var arduino = new ArduinoServer(generatePGConnectionURL());
    arduino.start();
}

// *** NOTES ***
// what I tried to do:
// start server
// start arduino data
    // insert arduino data as it comes in

// when requests data from server,
    // ask db for data
    // return json data
//
// queries:
//     var orderingByTime = "SELECT * FROM tempData ORDER BY timestamp asc;"
//     var avgTempCelcius = "SELECT avg(celcius) AS avgCelcius, SELECT avg(fahrenheit) as avgFahrhtm], EXTRACT(DOW from dateCreated) as day FROM tempData;"
//     var differenceTempCelcius = 'SELECT celcius, outsideTempCelcius, celcius-outsideTempCelcius AS DifferenceCelcius FROM tempdata'
//     var differenceTempFahrenheit = 'SELECT fahrenheit, outsideTempFahrenheit, fahrenheit-outsideTempFahrenheit AS DifferenceFahrenheit FROM tempdata'
//
// };
