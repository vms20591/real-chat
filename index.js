//Import required modules
var express=require('express');
var http=require('http');
var path=require('path');

//Create Express.js application
var app=express();

//Creating HTTP server
var server=http.createServer(app);

//Creating Websocket
var io=require('socket.io')(server);

//Retrieve address and port for server from command line args
var address=process.argv[2] || 'localhost';
var port=process.argv[3] || 5000;

//To serve HTML, CSS and JS files

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}

app.use(allowCrossDomain);
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/scripts'));
app.use(express.static(__dirname+'/styles'));

//Return index.html when '/' is accessed
app.get('/',function(req,resp){
	resp.sendFile('index.html');
});

//Create custom Websocket namespace
var customNs=io.of('/avengers-assemble');

//Register callbacks when a client connects
customNs.on('connection',function(clientSocket){
	
	//Store the client socket IP
	var clientIp=clientSocket.request.connection.remoteAddress.split(':').splice(-1);
	
	console.log('Client '+clientIp+': connected');
	
	//Emit a generic message to the socket that connected to server
	clientSocket.emit('serverChannel','Message from HQ: Welcome Avenger!');
	
	//Automatically connect the client socket to a custom chat room
	clientSocket.join('avengers');
	
	//Notify all the clients who are connected to the chat room, except the current one
	clientSocket.broadcast.to('avengers').emit('serverChannel','Client '+clientIp+': joined the chat');
	
	//When client sends a message, broadcast to rest of the clients in the chat room
	clientSocket.on('clientChannel',function(msg){
		console.log('Client '+clientIp+': '+msg);
		clientSocket.broadcast.to('avengers').emit('serverChannel','Message From '+clientIp+': '+msg);
	});

	//When client disconnects, broadcast the message to the rest of the clients in the chat room
	clientSocket.on('disconnect',function(msg){
		console.log('Client '+clientIp+': disconnected');
		clientSocket.to('avengers').emit('serverChannel','Client '+clientIp+': left the chat');
	});
});

//Start the HTTP server
server.listen(port,address);
console.log('Server running at http://'+address+':'+port);
console.log('User Ctrl+c to stop the server');
