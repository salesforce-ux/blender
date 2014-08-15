var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');

var MAX_QUEUE_SIZE = 2;

var blender = function(destDir, config, cb) {
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
				var convert = function() {
					if (tempSrcList.length === 0 && queue.length === 0) {
						cb();
					} else {
						if (queue.length > 0) {
							var filename = queue.shift(),
									unitSize = size.constant ? size.constant : iconType.unitSize,
									scale = size.scale ? size.scale : 1,
									scaleFactor = unitSize / iconType.longestDimension * scale,
									iconTypeSuffix = (iconType.suffix && !format.ignoreTypeSuffix) ? iconType.suffix : '',
									sizeDirectory = size.sizeDirectory ? size.sizeDirectory : '',
									sizeSuffix = size.suffix ? size.suffix : '';
									
							console.log('working on ....', filename, format.name);
							svg2png(iconType.src + '/'
										+ filename, destDir + '/' 
										+ format.name + '/' 
										+ iconType.name + '/' 
										+ sizeDirectory + '/' 
										+ path.basename(filename, '.svg') 
										+ iconTypeSuffix + sizeSuffix + '.png'
										, scaleFactor, 
							function() {
								console.log('finished ......', filename, format.name);
								if (tempSrcList.length > 0) {
									queue.push(tempSrcList.shift());
									convert();
								} else {
									convert();
								}
							});
							if (i < MAX_QUEUE_SIZE) {
								i++;
								convert();
							}
						}
					}
				}
				convert();
			});
		});
	});
};

module.exports = blender;