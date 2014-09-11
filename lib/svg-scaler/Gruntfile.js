var gulp = require('vinyl-fs');
var svgscaler = require('./index');

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.config('clean.dest', {
        src: ['./example/dest']
    });

    var sizes = ['16', '32', '64', '128', '256', '512'];

    grunt.registerTask('svg2pngs', function () {

        var done = this.async();
        var svg2pngFiles = [];

        var cnt = 0;

        sizes.forEach(function (size) {

            svg2pngFiles.push({
                src: ['example/dest/svg/' + size + '/*.svg'],
                dest: 'example/dest/png/' + size
            });

            gulp.src('example/src/*.svg')
                .pipe(svgscaler({ width: size}))
                .pipe(gulp.dest('example/dest/svg/' + size))
                .on('end', function () {
                    cnt++;
                    if (cnt === size.length) {
                        done();

                        grunt.config('svg2png.all', {
                            files: svg2pngFiles
                        });
                        grunt.task.run('svg2png');

                    }
                });
        });


    });

    grunt.registerTask('default', ['clean:dest', 'svg2pngs']);
};