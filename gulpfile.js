'use strict'

var gulp      = require('gulp');
var $         = require('gulp-load-plugins')();
var sequence  = require('run-sequence');
var del       = require('del');

gulp.task('clean:dist', function() {
  return del('dist');
});

gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('build/'))
});

gulp.task('inline', function() {
    return gulp.src('build/*.html')
        .pipe($.inlineCss())
        .pipe(gulp.dest('dist/'));
});

gulp.task('livereload', function() {
  return gulp.src('app/*.html')
    .pipe($.connect.reload());
});

gulp.task('livereload:styles', function () {
  sequence('styles', 'livereload');
});

gulp.task('templates', function() {
  var assets = $.useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('build'));
});

gulp.task('sendmail', function () {
  gulp.src( 'dist/*.html') // Modify this to select the HTML file(s)
  .pipe($.mailgun({
    key: 'key-ff6ee99e299abefde1da6eae58372c1d', // Enter your Mailgun API key here
    sender: 'march213@yahoo.com',
    recipient: ['march777@bk.ru', 'march213@yahoo.com', 'e.molodetskaya@qsoft.ru'],
    subject: 'Test template'
  }));
});

gulp.task('build', function() {
  sequence('clean:dist', 'templates', 'styles', 'inline', 'sendmail');
});

gulp.task('watch', function() {
  $.connect.server({
    livereload: {
      port: 35730
    },
    root: ['app', 'build'],
    port: 3000
  });

  gulp.watch('app/styles/*/**.scss', ['livereload:styles']);
  gulp.watch('app/*.html', ['livereload']);
});