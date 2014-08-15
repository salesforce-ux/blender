var fs     		= require('fs');
var path   		= require('path');



var blender		= require('./../lib/blender.js');


var types = [
    {type: 'utility',   suffix: '',         oneX: 18, inputWidth: 64,  inputHeight: 64,  src: './test/icons/utility'},
    {type: 'doctype',   suffix: '',         oneX: 18, inputWidth: 56,  inputHeight: 64,  src: './test/icons/doctype'},
    {type: 'action',    suffix: '',         oneX: 18, inputWidth: 36,  inputHeight: 36,  src: './test/icons/actions'},
    {type: 'custom',    suffix: '_anchor',  oneX: 48, inputWidth: 120, inputHeight: 120, src: './test/icons/custom'},
    {type: 'standard',  suffix: '_anchor',  oneX: 48, inputWidth: 120, inputHeight: 120, src: './test/icons/standard/svg'},
    {type: 'custom',    suffix: '_list',    oneX: 32, inputWidth: 120, inputHeight: 120, src: './test/icons/custom'},
    {type: 'standard',  suffix: '_list',    oneX: 32, inputWidth: 120, inputHeight: 120, src: './test/icons/standard/svg'}
];

var androidSizes = [
  {sizeLabel: '',   sizeDir : 'mdpi',   scale: 1,    ignoreSuffix: false},
  {sizeLabel: '',   sizeDir : 'hdpi',   scale: 1.5,  ignoreSuffix: false},
  {sizeLabel: '',   sizeDir : 'xhdpi',  scale: 2,    ignoreSuffix: false},
  {sizeLabel: '',   sizeDir : 'xxdpi',  scale: 3,    ignoreSuffix: false}
];

var xSizes = [
  {sizeLabel: '',    sizeDir : '',  scale: 1, ignoreSuffix: false},
  {sizeLabel: '@2x', sizeDir : '',  scale: 2, ignoreSuffix: false}
];

var apiSizes = [
  {sizeLabel: '_60',  sizeDir : '', scale: 1, size: 60,  ignoreSuffix: true},
  {sizeLabel: '_120', sizeDir : '', scale: 1, size: 120, ignoreSuffix: true}
];

var formats = [
  {sizes: androidSizes, name: 'android'},
  {sizes: xSizes,       name: 'ios'}
];

var config = {formats: formats, types: types}


jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000000;
var i = 4;
describe('blender', function() {

	beforeEach(function() {
		console.log('\nrunning test');
	});

	it("should create the appropriate folder structure", function(done) {
		blender('./test/output', config, function() {
			i--;
			if (i === 0) {
				done();
			}
		});
		expect(fs.existsSync('./test/output')).toBe(true);
		expect(fs.existsSync('./test/output/standard')).toBe(true);
		expect(fs.existsSync('./test/output/utility')).toBe(true);
		expect(fs.existsSync('./test/output/custom')).toBe(true);
	});

		// it("should create standard folder in output directory", function() {
		// });


		// it("should create utility folder in output directory", function() {
		// });

})


