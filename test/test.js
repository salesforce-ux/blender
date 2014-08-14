var fs     		= require('fs');
var path   		= require('path');



var blender		= require('./../lib/blender.js');


var types = [
	{
		type: 'utility', suffix: '_anchor', oneX: 18, src: './test/sample'
	},
	{
		type: 'standard', suffix: '_list', oneX: 32, src: './test/sample'
	},
	{
		type: 'custom', suffix: '_list', oneX: 32, src: './test/sample'
	},
	{
		type: 'doctype', suffix: '_list', oneX: 32, src: './test/sample'
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


jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
var i = 4;
describe('blender', function() {

	beforeEach(function() {
		console.log('\nrunning test');
	});

	it("should create the appropriate folder structure", function(done) {
		blender('./test/output', _config, function() {
			i--;
			if (i === 0) {
				done();
			}
		});
		expect(fs.existsSync('./test/output')).toBe(true);
		expect(fs.existsSync('./test/output/standard')).toBe(true);
		expect(fs.existsSync('./test/output/utility')).toBe(true);
	});

		// it("should create standard folder in output directory", function() {
		// });


		// it("should create utility folder in output directory", function() {
		// });

})


