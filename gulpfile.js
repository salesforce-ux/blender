var gulp		= require('gulp');
var gutil   = require('gulp-util');
var mocha		= require('gulp-mocha');
var rimraf 	= require('rimraf');


gulp.task('tdd', function() {
	console.log('starting test...');
	gulp.start('test');

	gulp.watch(['lib/**', 'test/testConfig.json'])
		.on('change', function(file) {
			console.log(file.path, 'changed');
			gulp.start('test');
		});
});

gulp.task('clean-test', function(done) {
	return rimraf('test/output', done)
});

gulp.task('test', ['clean-test'], function() {
	return gulp.src(['test/*.js'])
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', gutil.log);
});
