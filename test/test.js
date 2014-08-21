/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var assert 		= require('assert');
var fs     		= require('fs');
var path   		= require('path');
var should		= require('should');

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
		blender.convert('./test/icons/utility', './test/output', './test/testConfig.json', 18, ['android', 'api', 'ios'], function() {
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


