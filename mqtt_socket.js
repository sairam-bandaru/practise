var express = require('express');
var app = express();
var path = require('path');

// var app = require('express')();

var http = require('http').Server(app);
var express=require('express');

// create a socket object that listens on port 5000
var io = require('socket.io')(http);

// io.origins('*') // for latest version

var mqtt = require('mqtt');

var cors = require('cors');

app.use(cors());
// app.options('*', cors()) // include before other routes

var port     = process.env.PORT || 8000; // set our port
// START THE SERVER
// =============================================================================
http.listen(port, function () {
  console.log('Magic happens on port : ' + port);
});

app.use(express.static(__dirname));

console.log(__dirname);

var socket_name = 'xyz';
app.get('/',function(req,res){
	console.log('In the');
    res.sendFile(path.join(__dirname+'/socket.html'));
    // res.send("Hi! Welcome to Socket server")
    //__dirname : I t will resolve to your project folder.
  });


function onConnection(socket){
	console.log('Socket connect'); 
	// socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
  // io.sockets.emit('bme680','Hi 888888888');
 //io.socket.emit('Hi');
}


io.on('connection', onConnection);

//var client  = mqtt.connect('mqtt://localhost:1883'); //mqtt.connect('mqtt://127.0.0.1');
var client  = mqtt.connect('mqtt://broker.hivemq.com:1883'); 


client.on('connect', function () {
    client.subscribe("HE/#");
    console.log("Connected .....");
    //client.subscribe("#");
	// read_file();
   // setInterval(read_file(), 300000);
});

function onMessageReceived(topic, message){
    console.log('Topic **********', topic);
    console.log('Message **********', message.toString());
    io.sockets.emit('hedata',message.toString());
}

client.on("message", onMessageReceived);