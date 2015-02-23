var fs = require('fs');
var async = require('async');
var express = require('express');
var logger = require('morgan');
var socketio = require('socket.io');

// take a list of files from the command line.
// now we can watch three files using:
// node app.js file1.js file2.js file3.js
var filenames = Array.prototype.slice.call(process.argv, 2);
console.log(filenames);

// create the express app
var app = express();

// connect the Morgan logging middleware to our app
app.use( logger('dev') );

// start a server listening on port 1234
var server = app.listen( 1234 );
var io = socketio.listen(server);

// when someone requests http://localhost:1234/, run the callback
// function listed here and respond with the data
// we call this the "/" (or "Root") route.
//app.get("/", function(request, response) {
//buffer = ""
//for (var i = 0; i < filenames.length; i++) {
//buffer = buffer + filenames[i] + " contains: " +
//fs.readFileSync(filenames[i]).toString() + "<br>";
//}

// My attempt at parallel processing
//buffer = [];
//for (var i = 0; i < filenames.length; i++) {
//fs.readFile(filenames[i], function(err, data) {
//buffer.push(data.toString());
//});
//}
//console.log("buffer is: " + buffer);
//response.send('<p>' + buffer + '</p>');

app.set('view engine', 'ejs');

app.get('/', function (request, response) {

  var mapFilenamesToContent = function(filename, doneCallback) {
    fs.readFile(filename, function(err, data) {
      var object = { id: filename.replace(/[^0-9]/ig, ""),
                     data: data.toString(),
                     filename: filename
                   }
      return doneCallback(null, object);
    });
  };

  async.map(filenames, mapFilenamesToContent, function (err, results) {
    if (err) console.log('async.map error:', err);
    //response.send( '<pre>' + results.join("\n\n") + '</pre>' );
    response.render( 'mainView', { files: results} );
  });
});
