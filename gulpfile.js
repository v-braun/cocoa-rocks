const gulp = require('gulp');
const conf = require('./conf')
const sass = require('gulp-sass');
const connect = require('gulp-connect')
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserify = require('gulp-browserify');
const compileData = require('./gulp-compile-data');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const jsminify = require('gulp-minify');
const babel = require("gulp-babel");


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
      .pipe(babel({ presets: ['@babel/env']}))
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
