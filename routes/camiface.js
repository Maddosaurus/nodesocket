var path = require('path')

exports.getCamera = function(req,res) {
	res.sendfile(path.normalize(basedir) + '/client/cam01.jpg');
}

var inputs = [
		"rtsp://192.168.71.22",
		]
 	outputs = [
        "001"
        ],
	totalchildren = inputs.length,
	children = new Array(totalchildren),
	loop = undefined,
	frequency=10;

var checker = function() {
	loop = setInterval( function() {
		for (var i = 0; i < totalchildren; i++) {
			if (children[i] == undefined) {
				callFFmpeg( i, inputs[i], outputs[i]);
			}
		};
	}, frequency*1000);
}

function callFFmpeg (i, input, prefixout) {

	/**
	 * Variables for FFmpeg
	 **/
	var util 			= require('util'),
		exec 			= require('child_process').exec,
		rate 			= 4, // Video FPS rate.
		quality 		= 'qvga', // Quality of the image
		extraparams 	= '-b:v 32k',
		suffixout 		= 'camaraip', // Suffix for the JPEG output of FFmpeg
	//                prefixout001 = '001', prefixout002 = '002',
		outextension 	= 'jpg';

	/**
	 * Call to FFmpeg
	 **/
	children[i] = exec('ffmpeg -loglevel quiet -i ' + input + ' -r ' + rate + ' -s ' + quality + ' ' + extraparams + ' -f image2 -updatefirst 1 ' + basedir + imgdir + prefixout + '_' + suffixout + '.' + outextension, {maxBuffer: 2048*1024},
		function (error, stdout, stderr) {
			if (error !== null) {
				console.error('FFmpeg\'s ' + prefixout + ' exec error: ' + error);
			}
	});

	children[i].on('exit', function (code) {
		console.log('FFmpeg child: ' + inputs[i] + ' exited and is being re-launched');
		children[i] = undefined;
	});
	children[i].on('SIGTERM', function() {
		console.log('FFmpeg child: ' + inputs[i] + ' got terminated and is being re-launched');
		children[i] = undefined;
	});
}

/**
 * Calling checker()
 */
checker();

