var path 	= require('path'),
	fs 		= require('fs'),
	mime 	= require('mime');

var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var gfs;

var db = new mongo.Db('grDB', new mongo.Server("192.168.1.119", 27017));

db.open(function(err) {
	if(err) return handleError(err);
	gfs = Grid(db, mongo);
});

exports.getCamera = function(req,res) {
	var id        = req.params[0];
    var filename  = req.params[1];

	res.set('Content-type', mime.lookup(filename));
	//console.dir("AAA");

	gfs
	 .createReadStream({ _id: id })
	 .on('error', function(err) {
	 	res.send(404);
	 })
	 .pipe(res);
};

