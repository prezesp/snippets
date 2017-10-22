var gulp = require('gulp');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('copy', function() {
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'));

    gulp.src(['node_modules/scrollreveal/dist/scrollreveal.js', 'node_modules/scrollreveal/dist/scrollreveal.min.js'])
    .pipe(gulp.dest('vendor/scrollreveal'));

	gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('vendor/font-awesome'));

	gulp.src(['node_modules/highlight.js/styles/default.css'])
	.pipe(gulp.dest('vendor/highlight/styles/'));
});

gulp.task('sass', function() {
  return gulp.src('scss/bootstrap.scss')
    .pipe(sass())
    .pipe(gulp.dest('vendor/bootstrap/css'));
});

gulp.task('browserify', function() {
	return browserify('./highlight-config.js').bundle()
		.pipe(source('./highlight-config.js'))
		.pipe(rename('highlight-pack.js'))
		.pipe(gulp.dest('vendor/highlight'));
});

gulp.task('default', ['copy', 'browserify', 'sass']);