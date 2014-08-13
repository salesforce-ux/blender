var svg2png = require('svg2png');
var fs = require('fs');
var path = require('path');

var vendetta = function(){
	var src = fs.readdirSync('./sample');
	src.forEach(function(filename) {
		console.log("working");
		svg2png("./sample/" + filename, './output/' + path.basename(filename, '.svg') + '.png', 2.0, function (err) {});

	})
}


module.exports = vendetta();