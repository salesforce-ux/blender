var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var MAX_QUEUE_SIZE = 50;

var arrowFix = function(filename) {
	var result = '';
	for (var i = 0; i < 30 - filename.length; i++) {
		result += '-';
	}
	result += '>';
	return result;
};

var getLongestDimension = function(filename, cb) {
	var contents = fs.readFileSync(filename, 'utf-8');
	parser.parseString(contents, function(err, result) {
		cb(Math.max(result.svg['$'].width, result.svg['$'].height));
	});
};


var convert = function(srcDir, destDir, config, oneX, platform, cb) {
	config = typeof config !== 'undefined' ? config : JSON.parse(fs.readFileSync(__dirname + '/../config.json'));
	oneX = typeof oneX !== 'undefined' ? oneX : 18;
	platform = typeof platform !== 'undefined' ? platform : ['all'];

	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir);
	}

	var srcList = fs.readdirSync(srcDir);
	var index = srcList.indexOf('.DS_Store');
	if (index !== -1) {
		srcList.splice(index, 1);
	}
	var totalSizes = 0;
	config.formats.forEach(function(format) {
		if (platform.indexOf(format.name) !== -1 || platform[0] === 'all') {
			format.sizes.forEach(function(size) {
				totalSizes++;
			});
		}
	});
	var numReturns = totalSizes * srcList.length * 2;
	console.log('\nWaiting for', numReturns / 2, 'conversion(s)\n');
	config.formats.forEach(function(format) {
		if (!fs.existsSync(destDir + '/' + format.name)) {
			fs.mkdirSync(destDir + '/' + format.name);
		}
		if (platform.indexOf(format.name) !== -1 || platform[0] === 'all') {
			format.sizes.forEach(function(size) {
			var tempSrcList = srcList.concat();
			var queue = tempSrcList.length > MAX_QUEUE_SIZE / totalSizes 
				?	tempSrcList.splice(0, MAX_QUEUE_SIZE) 
				: tempSrcList.splice(0, tempSrcList.length);

				if (size.sizeDirectory && !fs.existsSync(destDir + '/' + format.name + '/' + size.sizeDirectory)) {
					fs.mkdirSync(destDir + '/' + format.name + '/' + size.sizeDirectory);
				}

				var i = 0;
				var convertNext = function() {
					if (tempSrcList.length === 0 && queue.length === 0 && --numReturns === 0) {
						console.log('\nTask Complete.\n');
						if (cb) cb();
					} else {
						if (queue.length > 0) {
							var filename = queue.shift();
							var unitSize = size.constant ? size.constant : oneX;
							var scale = size.scale ? size.scale : 1;
							getLongestDimension(srcDir + '/' + filename, function(longestDimension) {
								var scaleFactor = unitSize / longestDimension * scale;
								var formatName = format.name + '/';
								var sizeDirectory = size.sizeDirectory ? size.sizeDirectory + '/' : '';
								var sizeSuffix = size.suffix ? size.suffix: '';
								var destination = destDir + '/' + formatName + sizeDirectory	+ path.basename(filename, '.svg') + sizeSuffix + '.png';
								console.log('Converting ....', filename, arrowFix(filename), destination, 'target size:', unitSize * scale);
								svg2png(srcDir + '/' + filename, destination, scaleFactor, function(err) {
									if (!err) {
										console.log('Finished ......', filename, arrowFix(filename), destination, 'target size:', unitSize * scale);
										if (tempSrcList.length > 0) {
											queue.push(tempSrcList.shift());
										}
										convertNext();
									} else {
										console.error(err);
									}
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