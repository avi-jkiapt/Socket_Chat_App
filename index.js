const express = require('express');

const app = express();

var http = require('http');

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
const PORT = 3000||process.env.PORT;
var users = {};

const socketIO = require('socket.io');

//initialize a new socket instance by provide socket
var io = socketIO(server);

app.get('/', function(req,res){
 res.sendFile(__dirname + '/index.html');
});

//listen on connection event for new incoming sockets
io.on('connection',function(socket){
  //console.log('A user has joined' );
  
  io.emit('allUser',users);


 socket.on('join',function(name){
   users[socket.id] = name;
   socket.broadcast.emit('newUser', name +  ' has joined the chat App');
   io.emit('allUser',users);
 });

  socket.on('chat message', function(msg){
     io.emit('chat message',users[socket.id],msg);
     //console.log(socket.id + name+ " "+ msg);
 });

  socket.on('disconnect', function(){
     console.log(users[socket.id] + 'has disconneted');
     socket.broadcast.emit("newUser", users[socket.id] + " has left the Chat App.");
     delete users[socket.id];
		io.emit("allUser", users);
  });

});

server.listen(PORT,function(req,res){
   console.log("Server is listening on "+ PORT);
});