var fs     		= require('fs');
var path   		= require('path');



var blender		= require('./../lib/blender.js');


jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000000;
var i = 4;
describe('blender', function() {

	beforeEach(function() {
		console.log('\nrunning test');
	});

	it("should create the appropriate folder structure", function(done) {
		var config = fs.readFileSync('./config.json');
		blender('./test/output', JSON.parse(config), function() {
			console.log('complete');
			i--;
			if (i === 0) {
				console.log('go')
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


