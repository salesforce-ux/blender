/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var gulp = require('gulp');
var svgscaler = require('./svg-scaler/index.js')

var MAX_QUEUE_SIZE = 60; //Maximum number of concurrent conversions going on at a time. A max of 60 is recommended


/*
 *	Helper to prettify console output as conversion takes place
 */
var arrowFix = function(filename) {
	var result = '';
	for (var i = 0; i < 30 - filename.length; i++) {
		result += '-';
	}
	result += '>';
	return result;
};


/*
 *	Helper to read and retrieve the longest dimension of an SVG file to determine scaling factor	
 */
var getLongestDimension = function(filename, cb) {
	var contents = fs.readFileSync(filename, 'utf-8');
	parser.parseString(contents, function(err, result) {
		cb(Math.max(result.svg['$'].width, result.svg['$'].height));
	});
};


/*
 *	Conversion function that throttles the number of running functions at any time to MAX_QUEUE_SIZE. Implementation is recursive 
 *	and new functions are fired off only after another has finished
 */
var convert = function(srcDir, destDir, configPath, oneX, platform, cb) {

	/*
	 *	Sets default parameters and does standard error handling
	 */
	configPath = typeof configPath !== 'undefined' ? configPath : __dirname + '/../config.json';
	oneX = typeof oneX !== 'undefined' ? oneX : 18;
	platform = typeof platform !== 'undefined' ? platform : ['all'];
	if (fs.existsSync(configPath)) {
		config = JSON.parse(fs.readFileSync(configPath))
	} else {
		return console.log(configPath, 'is not a valid json file');
	}
	if (isNaN(oneX)) {
		return console.log(oneX, 'is not a valid unit size (must be a numeric value)');
	}

	var srcList = fs.readdirSync(srcDir);
	if (srcList.length === 0) {
		return console.log(srcDir, 'has no files');
	}
	var index = srcList.indexOf('.DS_Store');
	if (index !== -1) {
		srcList.splice(index, 1);
	}
	
	if (!fs.existsSync(destDir)) { //creates output directory
		fs.mkdirSync(destDir);
	}

	var totalSizes = 0; //number of different output directories
	config.formats.forEach(function(format) {
		if (platform.indexOf(format.name) !== -1 || platform[0] === 'all') {
			format.sizes.forEach(function(size) {
				totalSizes++;
			});
		}
	});
	var numReturns = totalSizes * srcList.length * 2; //sets how many times the recursive function should return before task complete
	console.log('\nWaiting for', numReturns / 2, 'conversion(s)\n');
	config.formats.forEach(function(format) {
		if (!fs.existsSync(destDir + '/' + format.name)) {
			fs.mkdirSync(destDir + '/' + format.name);
		}
		if (platform.indexOf(format.name) !== -1 || platform[0] === 'all') {
			format.sizes.forEach(function(size) {
			var tempSrcList = srcList.concat();
			var queue = tempSrcList.length > MAX_QUEUE_SIZE / totalSizes 
				?	tempSrcList.splice(0, MAX_QUEUE_SIZE/totalSizes) 
				: tempSrcList.splice(0, tempSrcList.length); //populates the queue with the first MAX_QUEUE_SIZE functions

				if (size.sizeDirectory && !fs.existsSync(destDir + '/' + format.name + '/' + size.sizeDirectory)) {
					fs.mkdirSync(destDir + '/' + format.name + '/' + size.sizeDirectory);
				}

				var i = 0; //counter to set off initial list of functions


				/*
				 *	Recursive step. Adds new files to the queue only when another has finished, ensuring a maximum number of concurrent running processes.
				 */
				var convertNext = function() {
					if (tempSrcList.length === 0 && queue.length === 0 && --numReturns === 0) { //recursive base case
						console.log('\nTask Complete.\n');
						if (cb) cb();
					} else {
						if (queue.length > 0) { //ensure there are items left in the queue
							var filename = queue.shift();
							var unitSize = size.constant ? size.constant : oneX;
							var scale = size.scale ? size.scale : 1;
							getLongestDimension(srcDir + '/' + filename, function(longestDimension) {
								var scaleFactor = unitSize / longestDimension * scale;
								var formatName = format.name + '/';
								var sizeDirectory = size.sizeDirectory ? size.sizeDirectory + '/' : '';
								var sizeSuffix = size.suffix ? size.suffix: '';
								var destination = destDir + '/' + formatName + sizeDirectory + path.basename(filename, '.svg') + sizeSuffix + '.png';
								console.log('Converting ....', filename, arrowFix(filename), destination, 'target size:', unitSize * scale);
								if (formatName === 'api/') {
									var svg_destination = destDir + '/' + formatName + sizeDirectory;
									gulp.src([srcDir + '/' + filename]).pipe(svgscaler({ scale: 1.0 })).pipe(gulp.dest(svg_destination));
								}
								svg2png(srcDir + '/' + filename, destination, scaleFactor, function(err) {
									console.log('Finished ......', filename, arrowFix(filename), destination, 'target size:', unitSize * scale);
									if (tempSrcList.length > 0) {
										queue.push(tempSrcList.shift());
									}
									convertNext(); //execute next file on completion
								});
								if (i < MAX_QUEUE_SIZE) { //continue adding to the queue if less than max queue running at once
									i++;
									convertNext();
								}
							});
						}
					}
				}
				convertNext();
			});
		}
	});
};

module.exports = {
	convert: convert
};