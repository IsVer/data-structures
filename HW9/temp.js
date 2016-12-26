//given code:
var five = require("./johnny-five");
var pg = require('pg');

//insert outside temperature
//'api.openweathermap.org/data/2.5/weather?zip=10027,us'


var modifyInsertQuery = function(data){
    var insertIntoQuery = "INSERT INTO temp_sensor (celsius, fahrenheit) VALUES";
    insertIntoQuery += "(" +  data.celsius + ', ' + data.fahrenheit + ");";
    return insertIntoQuery;
};

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
    user: 'niemand', //env var: PGUSER
    database: 'thermo', //env var: PGDATABASE
    password: 'password', //env var: PGPASSWORD
    host: 'test.crfdjdjhtntf.us-east-1.rds.amazonaws.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);



var insert = function(dataPoint) {
    // to run a query we can acquire a client from the pool,
    // run a query on the client, and then return the client to the pool
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var newDataInsertQuery = modifyInsertQuery(dataPoint);
        client.query(newDataInsertQuery, [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            // console.log(result.rows[0].number);
            //output: 1
        });
    });
};



five.Board().on("ready", function() {
    var temperature = new five.Thermometer({
        controller: "TMP36",
        pin: "A0"
    });

    temperature.on("change", function() {
        console.log(this.celsius + "°C", this.fahrenheit + "°F");
        var dataPoint = {"celsius": this.celsius, "fahrenheit": this.fahrenheit};
        console.log(modifyInsertQuery(dataPoint));
        insert(dataPoint);
    });
});
