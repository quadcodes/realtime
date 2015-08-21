var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

// "process.env.PORT" to set port by Heroku
var port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('listening on:' + port);
});
/*
var mandar = "";
io.on('connection', function(socket){
  socket.on('switch', function(msg){
    io.emit('switch', msg);
    socket.send('switch :' + msg);
    mandar = msg;
    console.log(mandar);
  });
});
*/

app.get('/sample', function(req, res){
   res.sendFile(__dirname + '/sample.html');
   var data = url.parse(req.url,true).query;
   res.send('Switch : ' + data.status);
});

app.get('/submit', function(req, res){
  var data = url.parse(req.url,true).query;
  io.emit('temperature', data);
  res.send('Temperature Updated to: ' + data.temperature);
});

io.on('connection', function(socket){
  socket.on('switch', function(msg){
    io.emit('switch', msg);
    socket.send('switch :' + msg);
    //console.log(msg);
  });
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
