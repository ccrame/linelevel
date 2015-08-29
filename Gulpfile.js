'use strict';

var gulp           = require('gulp'),
    jshint         = require('gulp-jshint'),
    gulpBrowserify = require('gulp-browserify'),
    concat         = require('gulp-concat'),
    minifyCSS      = require('gulp-minify-css'),
    minifyHTML     = require('gulp-minify-html'),
    uglify         = require('gulp-uglify');

var paths = {
  scripts: ['./client/*.js','./client/app/**/*.js'],
  tests: ['./specs/**/*.js'],
  styles: ['./client/css/*.css'],
  index: ['./client/index.html'],
  partials: ['./client/app/**/*.html']
};

// check files for syntax errors
gulp.task('lint',function(){
  gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// watch files and check for syntax error
gulp.task('watch',['lint'],function(){
  gulp.watch(paths.scripts,['lint']);
});

// minify all HTML files and put in public folder
gulp.task('HTML', function(){
  gulp.src(paths.partials)
    .pipe(minifyHTML())
    .pipe(gulp.dest('public/view'));
});

gulp.task('index', function(){
  gulp.src(paths.index)
    .pipe(minifyHTML())
    .pipe(gulp.dest('public/'));
});

// minify the CSS and put in public folder
gulp.task('CSS', function(){
  gulp.src(paths.styles)
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/styles'));
});

// browserfiy, concat, uglify
gulp.task('browserify',function(){
  gulp.src(['client/app.js'])
    .pipe(gulpBrowserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(concat('app.bundle.js'))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('lib',function(){
  gulp.src(['client/lib/*.js'])
    .pipe(gulp.dest('public/lib'))
});

gulp.task('default',['lint','browserify','index','lib','CSS','HTML','watch']);