'use strict';

var gulp           = require('gulp'),
    jshint         = require('gulp-jshint'),
    gulpBrowserify = require('gulp-browserify'),
    concat         = require('gulp-concat'),
    minifyCSS      = require('gulp-minify-css'),
    minifyHTML     = require('gulp-minify-html'),
    uglify         = require('gulp-uglify');

var paths = {
  scripts: ['client/*.js','client/app/*.js', 'client/app/**/*.js','server/*.js', 'server/**/*.js'],
  tests: ['specs/**/*.js'],
  styles: ['client/css/*.css'],
  index: ['client/index.html'],
  partials: ['client/**/*.js'],
  server: ['server/**/*.js', 'server/*.js']
};

gulp.task('lint',function(){
  gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('watch',['lint','message'],function(){
  gulp.watch(paths.scripts,['lint','message']);
});

gulp.task('default',['watch']);

gulp.task('browserify',function(){
  gulp.src(['./client/app.js'])
    .pipe(gulpBrowserify())
    .pipe(gulp.dest('public/scripts'));
});