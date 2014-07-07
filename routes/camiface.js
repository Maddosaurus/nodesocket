var path 	= require('path'),
	fs 		= require('fs'),
	mime 	= require('mime');

//look for IP of the host system
var sysip;
var os=require('os');
var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
	var alias=0;
	ifaces[dev].forEach(function(details){
		if (details.family=='IPv4' & details.internal==false) {
			sysip = details.address;
			++alias;
		}
	});
}

var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var gfs;

var db = new mongo.Db('grDB', new mongo.Server(sysip, 27017));


db.open(function(err) {
	if(err) return handleError(err);
	gfs = Grid(db, mongo);
});

exports.getCamera = function(req,res) {

	var id        = req.params[0];
	var filename  = req.params[1];

	res.set('Content-type', mime.lookup(filename));

	gfs
	 .createReadStream({ _id: id })
	 .on('error', function(err) {
		res.send(404);
	 })
	 .pipe(res);
};

