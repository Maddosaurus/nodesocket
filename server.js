var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(5885);

app.get('/', function (req, res) {
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write("nothing...");
	res.end();
});

io.sockets.on('connection', function (socket) {

  socket.emit('handshake', { message: 'pong' });  

  socket.on('request', function (data) {
    console.log(data);
    socket.emit('response', { result: 'harr' });
  });

});