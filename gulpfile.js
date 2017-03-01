var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var watch = require('gulp-watch');
var nodemon = require('gulp-nodemon');

var jsFiles = 'app_client/javascripts/**/*.js',
  csFiles = 'app_client/stylesheets/**/*.css',
  jsDest = 'dist/',
  csDest = 'dist/';

gulp.task('scripts', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js')) //concatenate all the files
    .pipe(annotate())//allow to minify angular files
    .pipe(gulp.dest(jsDest)) //save the file in the destination folder
    .pipe(rename('scripts.min.js')) //rename the file
    .pipe(uglify()) //minify the code
    .pipe(gulp.dest(jsDest)); //save the file in the destination folder
});

gulp.task('css', function() {
  return gulp.src(csFiles)
    .pipe(concat('styles.css')) //concatenate all the files
    .pipe(gulp.dest(csDest)) //save the file in the destination folder
    .pipe(rename('styles.min.css')) //rename the file
    .pipe(uglifycss()) //minify the code
    .pipe(gulp.dest(csDest)); //save the file in the destination folder
});

gulp.task('watch', function(){
  gulp.watch(['app_client/javascripts/**/*.js', 'app_client/stylesheets/**/*.css'],
    ['scripts', 'css']);
});

gulp.task('default', function(){
  nodemon({
    ignore: ['app_client/*', 'bower_components/*'],
    verbose: false,
  })
});

gulp.task('development', function(){
  gulp.start('scripts');
  nodemon({
    ignore: ['app_client/*', 'bower_components/*'],
    verbose: true,
  }).on('start', ['watch']); //nodemon run watch on start
});

gulp.task('production', function(){
  gulp.start('scripts');
  gulp.start('css');
});


