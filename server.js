// requires
var express = require ('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3004;
var pg = require('pg');

// setup config for the pool
var config = {
  database: 'pethotel',
  host: 'localhost',
  port: 5432,
  max: 20
};
// create new pool using config
var pool = new pg.Pool(config);
// static folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
 // spin up server
app.listen(port, function(){
  console.log('server up on', port);
});
// base url
app.get('/', function(req, res){
  console.log('base url hit');
  res.sendFile(path.resolve('public/views/index.html'));
});
app.post('/addClient', function(req, res){
  console.log('addClient route');
  var clientObject = {
    response: ('from addClient' , req.body)};
    pool.connect(function(err, connection, done){
      if (err) {
        console.log(err);
        res.send(400);
      } else {
        console.log('connected');
        res.send(clientObject);
      }
      connection.query("INSERT into petownerinfo (firstname, lastname ) values ($1, $2)", [req.body.firstName, req.body.lastName]);
      done();
    });
  });
  app.post('/addPet', function(req, res){
    console.log('addPet route');
    var petObject = {
      response: ('from addPet' , req.body)};
      pool.connect(function(err, connection, done){
        if (err) {
          console.log(err);
          res.send(400);
        } else {
          console.log('connected');
          res.send(petObject);
        }
        connection.query("INSERT into petownerinfo (pet, breed, color) values ($1, $2, $3)", [req.body.petName, req.body.petBreed, req.body.petColor]);
        done();
      });
    });
    // app.post('/', function(req, res){
    //   console.log('addpet route');
    //   var clientObject = {
    //     response: ('from addClient' , req.body)};
    //     pool.connect(function(err, connection, done){
    //       if (err) {
    //         console.log(err);
    //         res.send(400);
    //       } else {
    //         console.log('connected');
    //         res.send(clientObject);
    //       }
    //       connection.query("INSERT into petownerinfo (firstname, lastname ) values ($1, $2)", [req.body.firstName, req.body.lastName]);
    //       done();
    //     });
    //   });
app.get('/getClients', function(req, res){
  console.log('getClient route');
  var allClients = [];
  pool.connect(function(err, connection, done){
    if (err) {
      console.log(err);
      res.send(400);
    } else {
      console.log('connected get clients');
      var resultSet = connection.query("SELECT firstname, lastname FROM petownerinfo");
      resultSet.on('row', function (row) {
        console.log('are you running?', row);
        allClients.push(row);
      });
      resultSet.on('end', function(){
        console.log('allClients ->', allClients);
        res.send(allClients);
      done();
    });
    }
  });
});

//get table route
app.get ('/getTable', function (req, res){
  console.log('hit get Table');
  // array of everything in table
  var allTable = [];
  // connect to db
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.send( 400 );
    }// end Error
    else{
      console.log('connected to db');
      // send query for all owners in the 'pets' table and hold in a variable (resultSet)
      var resultSet = connection.query( "SELECT * from pethotel" );
      // convert each row into an object in the allTable array
      // on each row, push the row into allTable
      resultSet.on( 'row', function( row ){
        allTable.push( row );
      }); //end on row
      // on end of rows send array as response
      resultSet.on( 'end', function(){
        // close connection to reopen spot in pool
        done();
        // res.send array of owners
        res.send( allTable );
      }); //end on end
    } // end no error
  }); //end pool
}); //end table get
