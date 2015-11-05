$(document).ready(function(){

	//div where the incoming and outgoing chats are appended to
	var views=$('div.views');
	
	//form where the user sends the chat to
	var chatForm=$('.textBox #chatForm');
	
	//input box to type the chat
	var inputBox=$('.textBox .chatMessage');

	//create socket connetion
	var socket=io('http://localhost:5000/avengers-assemble');

	//when form is submitted prevent default action
	chatForm.submit(function(event){
		event.preventDefault();
		
		//retrieve the message from the input box
		var msg=inputBox.val();
		
		//send the message to server over a custom channel
		socket.emit('clientChannel',msg);

		//add the message to the "view" div
		var span="<span class='clientMessage'><b>Me: </b><br/>"+msg+"</span>";
		views.append(span);		

		//clear the input box
		inputBox.val('');
	});
	
	//Logging when successful connection to server is made
	socket.on('connect',function(){
		console.log('connected to server');
	});

	//when receiving a message over the server channel, append it to the "views" div
	socket.on('serverChannel',function(msg){
		var span="<span class='serverMessage'>"+msg+"</span>";
		views.append(span);
	});

	
});
