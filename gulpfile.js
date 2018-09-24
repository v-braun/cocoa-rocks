var gulp = require('gulp');
var conf = require('./conf')
var sass = require('gulp-sass');
var connect = require('gulp-connect')
var del = require('del');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
var browserify = require('gulp-browserify');
var compileData = require('./gulp-compile-data');
var rename = require("gulp-rename");
var htmlmin = require('gulp-htmlmin');
var jsminify = require('gulp-minify');


gulp.task('sass', function () {
  return gulp.src(conf.path.src('**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(conf.path.dist()))
    .pipe(connect.reload());
});
gulp.task('scripts', function() {
  return gulp.src(conf.path.src('index.js'))
      .pipe(browserify({
        insertGlobals : false
      }))
      .pipe(jsminify())
      .pipe(gulp.dest(conf.path.dist()))
      .pipe(connect.reload());
});
gulp.task('html', function() {
  return gulp.src(conf.path.src('**/*.html'))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }))
      .pipe(gulp.dest(conf.path.dist()))
      .pipe(connect.reload());
});
gulp.task('assets', () => {
  return gulp.src(conf.path.src('assets/**'))
      .pipe(gulp.dest(conf.path.dist('assets')))
      .pipe(connect.reload());  
});

gulp.task('data:validate', () => {
  return gulp.src(conf.path.root('data.json'))
      .pipe(compileData('validate', conf.path.src('data/data.compiled.json')));  
});

gulp.task('data:compile', () => {
  return gulp.src(conf.path.root('data.json'))
      .pipe(compileData('compile', conf.path.src('data/data.compiled.json')))
      .pipe(rename("data.compiled.json"))
      .pipe(gulp.dest(conf.path.src('data')));
      // .pipe(jsonminify()) handled trough browsify
      // .pipe(gulp.dest(conf.path.dist('assets')));  
});

gulp.task('data:dist', gulp.series('data:validate', 'data:compile'));


gulp.task('watch', function (done) {
  gulp.watch(conf.path.src('**/*.scss'), gulp.series('sass'));
  gulp.watch(conf.path.src('**/*.html'), gulp.series('html'));
  gulp.watch(conf.path.src('**/*.js'), gulp.series('scripts'));
  gulp.watch(conf.path.src('assets/**'), gulp.series('assets'));
  done();
});

gulp.task('clean', function () {
  return del(conf.path.dist());
});

gulp.task('connect', function (done) {
  connect.server({
      root: conf.path.dist(),
      port: conf.connect.port,
      livereload: conf.connect.livereload
  });
  done();
});

gulp.task('serve', gulp.series('clean', 'assets', 'html', 'sass', 'scripts', 'connect', 'watch'));
gulp.task('dist', gulp.series('clean', 'assets', 'html', 'sass', 'scripts'));
