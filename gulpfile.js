// Load Gulp and necessary plugins
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const browserSync = require('browser-sync').create();

function css() {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src('src/html/**/*.html')
    .pipe(plumber())
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
}

// Serve and watch files
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('src/scss/**/*.scss', css).on('change', browserSync.reload);
  gulp.watch('src/html/**/*.html', html).on('change', browserSync.reload);
}

function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost:3000',
    port: 3000,
  });
  gulp.watch('src/scss/**/*.scss', gulp.series(css));
  gulp.watch('src/html/**/*.html', gulp.series(html, browserSync.reload));
}

exports.css = css;
exports.html = html;
exports.watch = watch;
exports.default = gulp.series(gulp.parallel(css, html), serve);
