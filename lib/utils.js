var fs = require('fs');
var path = require('path');

var getSvgRecursive = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else if (file.indexOf('.svg') !== -1) {
          results.push(path.basename(file, '.svg'));
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = {
  getSvgRecursive: getSvgRecursive
};