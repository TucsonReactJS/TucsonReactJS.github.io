'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plugins = require('gulp-load-plugins')();
var $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });
var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};

gulp.task('browser-sync',  ['build'],  function() {
  browserSync({
    server: {
      baseDir: './',
      directory: false
    },
    open: false
  });
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('clean', function(cb) {
  del(['css','posts'], cb);
});
 
gulp.task('css', function () {
    return gulp.src('src/css/*.less')
        .pipe($.less())
        .on('error', handleError)
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.csso())
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

gulp.task('jade', function () {
    return  gulp.src(['./src/**/*.jade','!./src/layouts/**/*.jade'])
        .pipe($.jade())
        .pipe(gulp.dest('./'))
        .pipe(reload({stream:true}));
});

gulp.task('build', ['css','jade']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build', 'browser-sync']);
    gulp.watch('**/*.less', ['css']);
    gulp.watch('**/*.jade', ['jade']);
});