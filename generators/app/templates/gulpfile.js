var gulp = require('gulp');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['nodemon'], function () {
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'dist/index.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});
