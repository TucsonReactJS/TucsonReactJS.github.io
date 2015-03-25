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

gulp.task('browser-sync',  [,  function() {
  browserSync({
    server: {
      baseDir: './',
      directory: true
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

gulp.task('posts', function () {
    return  gulp.src('./src/posts/**/*.jade')
        .pipe($.jade())
        .pipe(gulp.dest('./posts'))
        .pipe(reload({stream:true}));
});

gulp.task( ['css','posts']);

gulp.task('default', ['clean'], function () {
    gulp.start([ 'browser-sync']);
    gulp.watch('**/*.less', ['css']);
    gulp.watch('**/*.jade', ['posts']);
});