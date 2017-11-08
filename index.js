var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = Number(process.env.PORT || 3000);

app.get('/', function(req,res){
  res.send("Hello World !");
})

server.listen(port, ()=>{
    console.log("Server running at port "+ port);
});

var nicknames = {} ;

io.sockets.on('connection', function(socket){
  socket.on('user message', function(msg){
    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function(nick, fn){
    if(nicknames[nick]){
      fn(true);
    }else{
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', nick + ' connected');
      io.socket.emit('nicknames', nicknames);
    }
  });

  socket.on('disconnect', function(){
    if(!socket.nickname) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});
