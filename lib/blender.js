var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');
var request = require('request');

var MAX_QUEUE_SIZE = 20;

var types = [
	{
		type: 'utility', suffix: '_anchor', oneX: 18, src: '../sample'
	},
	{
		type: 'standard', suffix: '_list', oneX: 32, src: '../sample'
	}
];

var androidSizes = [
	{
		sizeLabel: '@2x', sizeDir: 'mdpi', scale: 1.5, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'hdpi', scale: 3.0, ignoreSuffix: false
	}
];

var formats = [
	{
		sizes: androidSizes, name: 'android'
	}
];

var _config = {
	formats: formats, types: types
};


var blender = function(srcDir, destDir, config) {
	console.log(config)
	config.formats.forEach(function(format) {
		config.types.forEach(function(type) {
			console.log('type', type);
			format.sizes.forEach(function(size) {
				var srcList = fs.readdirSync(srcDir);
				srcList.splice(srcList.indexOf('.DS_Store'), 1);

				var tempSrcList = srcList.concat();

				var queue = [];

				if (tempSrcList.length > MAX_QUEUE_SIZE) {
					queue = tempSrcList.splice(0, MAX_QUEUE_SIZE);
				}

				var i = 0;
				var foo = function() {
					if (tempSrcList.length === 0 && queue.length === 0) {
						console.log('complete');
					} else {
						if (queue.length > 0) {
							var filename = queue.shift();
							console.log('working on ....', filename);
							svg2png(srcDir + '/' + filename, destDir + '/' + type.type + '/' + path.basename(filename, '.svg') + size.scale + '.png', size.scale, function() {
								console.log('finished', filename);
								if (tempSrcList.length > 0) {
									queue.push(tempSrcList.shift());
									foo();
								} else {
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

module.exports = blender('../sample', '../output', _config);