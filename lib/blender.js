var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');

var MAX_QUEUE_SIZE = 2;

var arrowFix = function(filename) {
	var result = '';
	for (var i = 0; i < 30 - filename.length; i++) {
		result += '-';
	}
	result += '>';
	return result;
};

var convert = function(destDir, config, cb) {
	config.formats.forEach(function(format) {
		config.iconTypes.forEach(function(iconType) {
			format.sizes.forEach(function(size) {
				var srcList = fs.readdirSync(iconType.src);
				if (srcList.indexOf('.DS_Store') !== -1) {
					srcList.splice(index, 1);
				}
				var tempSrcList = srcList.concat();
				var queue = tempSrcList.length > MAX_QUEUE_SIZE 
										?	tempSrcList.splice(0, MAX_QUEUE_SIZE) 
										: tempSrcList.splice(0, tempSrcList.length);

				var i = 0;
				var convertNext = function() {
					if (tempSrcList.length === 0 && queue.length === 0) {
						if (cb) cb();
					} else {
						if (queue.length > 0) {
							var filename = queue.shift(),
									unitSize = size.constant ? size.constant : iconType.unitSize,
									scale = size.scale ? size.scale : 1,
									scaleFactor = unitSize / iconType.longestDimension * scale,
									formatName = format.name + '/',
									typeName = iconType.name + '/',
									sizeDirectory = size.sizeDirectory ? size.sizeDirectory + '/' : '',
									iconTypeSuffix = (iconType.suffix && !format.ignoreTypeSuffix) ? iconType.suffix : '',
									sizeSuffix = size.suffix ? size.suffix: '',
									destination = destDir + '/' + formatName + typeName + sizeDirectory	+ path.basename(filename, '.svg') + iconTypeSuffix + sizeSuffix + '.png';
							console.log('working on ....', filename, arrowFix(filename), destination);
							svg2png(iconType.src + '/' + filename, destination, scaleFactor, function() {
								console.log('finished ......', filename, arrowFix(filename), destination);
								if (tempSrcList.length > 0) {
									queue.push(tempSrcList.shift());
									convertNext();
								} else {
									convertNext();
								}
							});
							if (i < MAX_QUEUE_SIZE) {
								i++;
								convertNext();
							}
						}
					}
				}
				convertNext();
			});
		});
	});
};

module.exports = {
	convert: convert
};