//given code:
var five = require("./johnny-five");
var pg = require('pg');

//insert outside temperature
//'api.openweathermap.org/data/2.5/weather?zip=10027,us'

var arduinoServer = function(connString) {

    this.board = new five.Board();
    this.connString = connString;

    this.insert = function(dataPoint) {

        //create conn
        pg.connect(this.connString, function(err, client, done) {

            if (err) { return console.error('error fetching client from pool', err); }

            var newDataInsertQuery = modifyInsertQuery(dataPoint);

            client.query(newDataInsertQuery, function(err, result) {
                done();

                if (err) {return console.error('error running query', err);}

            });

        });
    };

    this.start = function() {
        var self = this;

        this.board.on("ready", function() {
            var thermometer = new five.Thermometer({
                controller: "TMP36",
                pin: "A0"
            });


            thermometer.on("change", function() {
                var dataPoint = {
                    "date" : new Date().getTime(),
                    "celsius" : parseFloat(this.celsius),
                    "fahrenheit" : parseFloat(this.fahrenheit)
                };

                self.insert(dataPoint);
            });
        });
    };

};

var modifyInsertQuery = function(data){
    var insertIntoQuery = "INSERT INTO tempData VALUES";
    insertIntoQuery += "('" + data.date + '\', ' +  data.celsius + ', ' + data.fahrenheit + ");";
    return insertIntoQuery;
};

var getTimeStamp = function () {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
    + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
        .getSeconds()) : (now.getSeconds())));
};

module.exports = arduinoServer;


//db.insert(data);
