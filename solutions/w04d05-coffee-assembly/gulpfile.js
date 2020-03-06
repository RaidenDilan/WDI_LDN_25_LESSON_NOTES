const gulp       = require('gulp');
const babel      = require('gulp-babel');
const del        = require('del');
const sass 		   = require('gulp-sass');
const cleanCSS   = require('gulp-clean-css');
const plumber    = require('gulp-plumber');
const nodemon    = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const sequence   = require('gulp-sequence');

const src  = 'src';
const dist = 'public';

gulp.task('clean', () => {
  del(['public/**/*']);
});

gulp.task('nodemon', () => {
  return nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('scripts', () => {
  return gulp.src(`${src}/**/*.js`)
		.pipe(plumber())
		.pipe(babel({ presets: ['es2015']}))
		.pipe(gulp.dest(dist))
    .pipe(livereload());
});

gulp.task('sass', () => {
  return gulp.src(`${src}/**/style.scss`)
    .pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS({ compatibility: 'ie8'}))
    .pipe(plumber())
    .pipe(gulp.dest(dist))
    .pipe(livereload());
});

gulp.task('assets', () => {
  return gulp.src(`${src}/assets/**/*`)
    .pipe(gulp.dest(`${dist}/assets`));
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(`${src}/**/*.js`, ['scripts']);
  gulp.watch(`${src}/**/*.scss`, ['sass']);
  gulp.watch(`${src}/assets/**/*`, ['assets']);
});

gulp.task('default', sequence('clean', ['scripts', 'sass', 'assets'], 'watch', 'nodemon'));
