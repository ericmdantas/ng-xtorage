"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coveralls = require('gulp-coveralls');
var rename = require('gulp-rename');
var karma = require('karma').server;

var _coverage = './coverage/**/lcov.info';
var _ngXtorage = 'ng-xtorage.js';
var _ngXtorageMin = 'ng-xtorage.min.js';

gulp.task('build', ['unit_test'], function()
{
    gulp
        .src(_ngXtorage)
        .pipe(uglify())
        .pipe(rename(_ngXtorageMin))
        .pipe(gulp.dest('.'))
})

gulp.task('unit_test', function(done)
{
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
    }, done);
})

gulp.task('coverage', ['unit_test'], function()
{
    gulp
        .src(_coverage)
        .pipe(coveralls());
})