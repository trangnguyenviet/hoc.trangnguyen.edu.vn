/**
 * Created by tanmv on 01/06/2017.
 */
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-cssnano');
var reactmin = require('gulp-jsmin');
var jsmin = require('gulp-uglify');
// var jsmin = require('gulp-minify');

// Default Task
//gulp.task('default', ['sass', 'js', 'react', 'watch']);
gulp.task('default', ['watch']);

gulp.task('rebuild', ['sass', 'js', 'react', 'css']);

// Compile Our Sass
gulp.task('sass', () => {
	return gulp.src('app/assets/scss/*.scss')
		.pipe(sass())
		.pipe(minifyCss({ zindex: false }))
		// .pipe(rename({suffix: '.min'}))
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('app/public/css/'))
		.pipe(livereload());
});

// Compile Our css
gulp.task('css', () => {
	return gulp.src('app/assets/css/*.css')
		.pipe(minifyCss({ zindex: false }))
		// .pipe(rename({suffix: '.min'}))
		.pipe(concat('plugin.min.css'))
		.pipe(gulp.dest('app/public/css/'))
		.pipe(livereload());
});

// Compile Our javascript
gulp.task('js', () => {
	// return gulp.src(['app/assets/script/**/*.js','!app/assets/script/react/*.js'])
	return gulp.src(['app/assets/script/**/*.js'])
		.pipe(jsmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/public/js/'))
		.pipe(livereload());
});

// Compile Our react
gulp.task('react', () => {
	return gulp.src('app/assets/react/**/*.js')
		.pipe(reactmin())
		.pipe(rename({prefix: '', suffix: '', extname: '.html'}))
		.pipe(gulp.dest('app/views/game/'))
		.pipe(livereload());
});

// Watch Files For Changes
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(['app/assets/scss/**/*.scss'], ['sass']);
	gulp.watch(['app/assets/css/**/*.css'], ['css']);
	gulp.watch(['app/assets/script/**/*.js'], ['js']);
	gulp.watch(['app/assets/react/**/*.js'], ['react']);
});