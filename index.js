// Quick configuration of usb port
var arduinoSerialPort = "/dev/cu.usbmodem431";

var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
//var SerialPort = require('serialport').SerialPort;
var fs = require('fs');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance



// "process.env.PORT" to set port by Heroku
var port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('listening on:' + port);
});

// Init connexion with usb
var serialport = require('serialport');
var usb = new serialport.SerialPort(arduinoSerialPort, {
  parser: serialport.parsers.readline('\n')
});

/*
// Serial Port
var serialPort = new SerialPort("/dev/cu.usbmodem431", {
    baudrate: 9600,
    parser: SerialPort.parsers.readline("\n")
});
*/

var switch_status;
io.on('connection', function(socket){
  socket.on('switch', function(msg){
    switch_status = msg;
    console.log(msg);
/*
    serialPort.write(msg + "\n", function(err, results) {
        console.log('bytes written: ', results);
    });    */
    
  });
});

app.get('/switch', function(req, res){
  res.json({ switch: switch_status });
});

app.get('/submit', function(req, res){
  var data = url.parse(req.url,true).query;
  io.emit('temperature', data);
  res.send('Temperature Updated to: ' + data.temperature);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


//data from arduino
serialPort.on('data', function(data) {
	console.log('serialpor data received: ' + data);
	try{
		var length = JSON.parse(data).length;
		//console.log("length = " + length);
		io.sockets.emit('emit_from_server', length);
	}catch(e){
		//eat it;
	}
	
});



serialPort.on('close', function(err) {
    console.log('port closed');
});

//serialport open
serialPort.open(function () {
  console.log('port open');
});
