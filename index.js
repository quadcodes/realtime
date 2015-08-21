var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance


server.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/submit', function(req, res){
  var data = url.parse(req.url,true).query;
  io.emit('temperature', data);
  res.send('Temperature Updated to: ' + data.temperature);
});

/*
io.on('connection', function(socket, res) {
  socket.on('switch', function(status) {
    io.emit('switch', status);
    res.send('switch :' + status);
  });
});
*/

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
