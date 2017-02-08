const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', ['nodemon'], () => {});

gulp.task('nodemon', (cb) => {
    let started = false;

    return nodemon({
        script: 'dist/index.js',
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    });
});
