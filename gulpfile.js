var gulp		= require('gulp');
var gutil   = require('gulp-util');
var jasmine = require('gulp-jasmine');



gulp.task('tdd', function() {
	console.log('starting test...');
	gulp.start('test');

	gulp.watch(['lib/**'])
		.on('change', function(file) {
			gulp.start('test');
		});
});

gulp.task('test', function() {
	return gulp.src(['test/*.js'])
		.pipe(jasmine({ verbose: true }))
		.on('error', gutil.log);
});