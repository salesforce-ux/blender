var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');

var MAX_QUEUE_SIZE = 2;

var blender = function(destDir, config, cb) {
	config.formats.forEach(function(format) {
		config.types.forEach(function(type) {
			format.sizes.forEach(function(size) {
				var srcList = fs.readdirSync(type.src);
				var index = srcList.indexOf('.DS_Store');
				if (index !== -1) {
					srcList.splice(index, 1);
				}
				var tempSrcList = srcList.concat();
				var queue = [];

				if (tempSrcList.length > MAX_QUEUE_SIZE) {
					queue = tempSrcList.splice(0, MAX_QUEUE_SIZE);
				} else {
					queue = tempSrcList.splice(0, tempSrcList.length);
				}

				var i = 0;
				var foo = function() {
					if (tempSrcList.length === 0 && queue.length === 0) {
						console.log('complete');
						cb();
					} else {
						if (queue.length > 0) {
							var filename = queue.shift();
							console.log('working on ....', filename);
							var suff = type.suffix;
							if(size.ignoreSuffix) {suff = '';}

							var maxDim = Math.max(type.inputHeight, type.inputWidth);

							var scaleFactor = type.oneX / maxDim * size.scale;
							svg2png(type.src + '/' + filename, destDir + '/' + format.name + '/' + type.type + '/' + size.sizeDir + '/' + path.basename(filename, '.svg') + suff + size.sizeLabel + '.png', scaleFactor, function() {
								console.log('finished', filename);
								if (tempSrcList.length > 0) {
									queue.push(tempSrcList.shift());
									foo();
								} else {
									console.log('gets here', queue.length);
									foo();
								}
							});
							if (i < MAX_QUEUE_SIZE) {
								i++;
								foo();
							}
						}
					}
				}
				foo();
			});
		});
	});
};

module.exports = blender;