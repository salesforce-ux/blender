var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');


var blender = function(srcDir, destDir, config) {
	var srcList = fs.readdirSync(srcDir);

	var tempSrcList = srcList.concat();

	var queue = [];

	while (tempSrcList.length > 0) {
		if (queue.length < 20) {
			queue.push(tempSrcList.shift());
		}
		if (queue.length > 0) {
			var filename = queue.shift();
			svg2png("./sample/" + filename, './output/' + path.basename(filename, '.svg') + '.png', 2.0, function() {
				
			});
		}
	}
};

module.exports = {
	blender: blender
}