var path 	= require('path'),
	fs 		= require('fs'),
	mime 	= require('mime');

var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var gfs;

var db = new mongo.Db('grDB', new mongo.Server("192.168.1.119", 27017));
//var databaseUrl = "192.168.1.119/grDB"; // "username:password@example.com/mydb"
//var collections = ["fs.files"]
//var db = require("mongodb").connect(databaseUrl, collections);

db.open(function(err) {
	if(err) return handleError(err);
	gfs = Grid(db, mongo);
});

exports.getCamera = function(req,res) {
	res.set('Content-type', mime.lookup("xxx.jpg"));
	console.dir("AAA");

	gfs
	 .createReadStream({ _id: "529f98016ff48dc0a0c2e66a" })
	 .on('error', function(err) {
	 	res.send(404);
	 })
	 .pipe(res);
	//res.sendfile(path.normalize(basedir) + '/' + imgdir + 'cam01.jpg');
};

