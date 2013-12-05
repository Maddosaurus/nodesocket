//var app = require('express')()
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	//, server = require('http').createServer(express)
	, io = require('socket.io').listen(server)
	, camiface	 = require('./routes/camiface')
	, path = require('path');

server.listen(5885);

app.configure(function(){
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.bodyParser());
});

app.get('/', function (req, res) {
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write("nothing...");
	res.end();
});

//app.get('/^\/uploads\/([a-f0-9]+)\/(.*)$/', camiface.getCamera);
app.get('/uploads/529f97fa6ff48dc0a0c2e646/xxx.jpg', camiface.getCamera);


io.configure('production', function(){
	console.log("set config for production");
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
	io.set('transports', [                     // enable all transports (optional if you want flashsocket)
			'websocket'
		, 'flashsocket'
		, 'htmlfile'
		, 'xhr-polling'
		, 'jsonp-polling'
	]);
});

io.configure('dev', function(){
	console.log("set config for development");
	io.set('transports', ['websocket']);
});

io.sockets.on('connection', function (socket) {

	socket.emit('handshake', { message: 'pong' });  

	socket.on('request', function (data) {
		console.log(data);
		socket.emit('response', camiface.getCamera);
	});

});
