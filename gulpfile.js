'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const frontMatter = require('front-matter');
const reload = browserSync.reload;
const plugins = require('gulp-load-plugins')();
const _ = require('lodash');
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });
const getBundleName = function () {
  let version = require('./package.json').version;
  let name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};
let pagesAttributes = {
  posts: []
}

gulp.task('browser-sync',  ['build'],  function() {
  browserSync({
    server: {
      baseDir: './',
      directory: false
    },
    files:['**/*.html','**/*.css'],
    open: false,
    notify: false
  });
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('clean', function(cb) {
  del(['css','posts','js'], cb);
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

gulp.task('posts', function(){
    return gulp.src(['./src/posts/**/_*.jade'])
    .pipe($.data(function(file) {
      let content = frontMatter(String(file.contents));
      file.contents = new Buffer(content.body);
      content.attributes.path = file.relative.split('.jade').join('.html');
      pagesAttributes.posts.push(content.attributes);
      return content.attributes;
    }))
    .pipe($.jade())
    .pipe(gulp.dest('./posts'));
})

gulp.task('jade',['posts'], function () {
  pagesAttributes.posts = _.uniq(pagesAttributes.posts, function(post){
    return post.path;
  });

  return gulp.src(['./src/**/*.jade','!./src/layouts/**/*.jade','!./src/posts/**/_*.jade'])
    .pipe($.data(function(file) {
      let content = frontMatter(String(file.contents));
      file.contents = new Buffer(content.body);
      let attributes = _.assign({}, content.attributes, pagesAttributes);
      return attributes;
    }))
    .pipe($.jade({pretty:true}))
    .pipe(gulp.dest('./'))
    .pipe(reload({stream:true}));
});

gulp.task('build', ['css','jade']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build', 'browser-sync']);
    gulp.watch('**/*.less', ['css']);
    gulp.watch('**/*.jade', ['jade']);
});