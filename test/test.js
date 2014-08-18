var assert 		= require('assert');
var fs     		= require('fs');
var path   		= require('path');
var should		= require('should');


var utils 		= require('./../lib/utils.js');
var blender		= require('./../lib/blender.js');

var configJSON = fs.readFileSync('./test/testConfig.json'),
		config = JSON.parse(configJSON),
		x = 0,
		y = config.iconTypes.length;

config.formats.forEach(function(format) {
	x += format.sizes.length;
});

var numReturns = x * y * 2;
var numFiles = x * y;
describe('====== Running blender(\'\.\/test\/output\') ======\n', function() {
	this.timeout(500000);
	it('should create the appropriate folder structure', function(done) {
		blender.convert('./test/output', config, function() {
			if (--numReturns === 0) {
				assert.equal(fs.existsSync(__dirname + '/output'), true);
				config.formats.forEach(function(format) {
					config.iconTypes.forEach(function(iconType) {
						assert.equal(fs.existsSync(__dirname + '/output/' + format.name), true);
						format.sizes.forEach(function(size) {
							if (size.sizeDirectory) {
								assert.equal(fs.existsSync(__dirname + '/output/' + format.name + '/' + iconType.name + '/' + size.sizeDirectory), true);
							}
						});
					});
				});
				done();
			}
		});
	});
	
	it('should properly add suffixes when specified', function(done) {
		config.formats.forEach(function(format) {
			config.iconTypes.forEach(function(iconType) {
				format.sizes.forEach(function(size) {
					var srcList;
					var formatName = format.name + '/',
							typeName = iconType.name + '/',
							sizeDirectory = size.sizeDirectory ? size.sizeDirectory + '/' : '',
							iconTypeSuffix = (iconType.suffix && !format.ignoreTypeSuffix) ? iconType.suffix : '',
							sizeSuffix = size.suffix ? size.suffix: '';
					var cb = function() {
						srcList.forEach(function(icon) {
							var destination = __dirname + '/output/' + formatName + typeName + sizeDirectory	+ path.basename(icon, '.svg') + iconTypeSuffix + sizeSuffix + '.png';
							console.log('checking if', destination, 'exists');
							assert.equal(fs.existsSync(destination), true);
						});
						if (--numFiles === 0) {
							done();
						}
					}
					utils.getSvgRecursive(__dirname + '/../' + iconType.src, function(err, _srcList) {
						srcList = _srcList.concat();
						cb();
					});
				});
			});
		});
	});

});


