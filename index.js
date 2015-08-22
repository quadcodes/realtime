var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var serialport = require('serialport');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

// Serial Port
var portName = '/dev/cu.usbserial-A9E9H3RJ'; // Mac環境
var sp = new serialport.SerialPort(portName, {
    baudrate: 115200,
    parser: serialport.parsers.readline("\n"),
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});

// "process.env.PORT" to set port by Heroku
var port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('listening on:' + port);
});



var switch_status;
io.on('connection', function(socket){
  socket.on('switch', function(msg){
    switch_status = msg;
    console.log(msg);
	//write to serialport
  	sp.write(msg + "\n", function(err, results) {
        console.log('bytes written: ', results);
    });   
    
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
sp.on('data', function(data) {
	console.log('serialpor data received: ' + data);
	try{
		var length = JSON.parse(data).length;
		//console.log("length = " + length);
		io.sockets.emit('emit_from_server', length);
	}catch(e){
		//eat it;
	}
	
});



sp.on('close', function(err) {
    console.log('port closed');
});

//serialport open
sp.open(function () {
  console.log('port open');
});
