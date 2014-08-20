var assert 		= require('assert');
var fs     		= require('fs');
var path   		= require('path');
var should		= require('should');


var utils 		= require('./../lib/utils.js');
var blender		= require('./../lib/blender.js');

var configJSON = fs.readFileSync('./test/testConfig.json'),
		config = JSON.parse(configJSON),
		x = 0;

config.formats.forEach(function(format) {
	x += format.sizes.length;
});


describe('====== Running blender(\'\.\/test\/output\') ======\n', function() {
	this.timeout(500000);
	it('should create the appropriate folder structure', function(done) {
		blender.convert('./test/icons/utility', './test/output', config, 18, ['android', 'api', 'ios'], function() {
			assert.equal(fs.existsSync(__dirname + '/output'), true);
			config.formats.forEach(function(format) {
				assert.equal(fs.existsSync(__dirname + '/output/' + format.name), true);
				format.sizes.forEach(function(size) {
					if (size.sizeDirectory) {
						assert.equal(fs.existsSync(__dirname + '/output/' + format.name + '/' + size.sizeDirectory), true);
					}
				});
			});
			done();
		});
	});

});


