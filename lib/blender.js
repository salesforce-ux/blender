var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');
var request = require('request');

var MAX_QUEUE_SIZE = 2;

var types = [
	{
		type: 'utility', suffix: '_anchor', oneX: 18, src: './sample'
	},
	{
		type: 'standard', suffix: '_list', oneX: 32, src: './sample'
	},
	{
		type: 'custom', suffix: '_list', oneX: 32, src: './sample'
	},
	{
		type: 'doctype', suffix: '_list', oneX: 32, src: './sample'
	}	
];

var androidSizes = [
	{
		sizeLabel: '@2x', sizeDir: 'mdpi', scale: 1.5, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'hdpi', scale: 3.0, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xxdpi', scale: 4.0, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xdpi', scale: 5.0, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xxdpi', scale: 1.0, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xxxdpi', scale: 2.0, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xdxxpi', scale: 2.5, ignoreSuffix: false
	},
	{
		sizeLabel: '', sizeDir: 'xxxxxdpi', scale: 60, ignoreSuffix: false
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
							svg2png(type.src + '/' + filename, destDir + '/' + type.type + '/' + path.basename(filename, '.svg') + size.scale + '.png', size.scale, function() {
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