var gulp        = require('gulp');
var gutil       = require('gulp-util');
var notify      = require('gulp-notify');
var less        = require('gulp-less');
var autoprefix  = require('gulp-autoprefixer');
var jshint      = require('gulp-jshint');
var rename 		= require('gulp-rename');
var changed 	= require('gulp-changed');
var cache	 	= require('gulp-cached');
var minifyCSS   = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var concat 		= require('gulp-concat');
var debug 		= require('gulp-debug');
var exec        = require('child_process').exec;
var sys         = require('sys');
 
// Where do you store your Less files?
var lessDir = 'www/assets/less';

// Where do you store your JS files?
var jsDir = 'www/assets/scripts';
 
// Which directory should Sass compile to?
var targetCSSDir = 'www/assets/css';
 
// Which directory should CoffeeScript compile to?
var targetJSDir = 'www/assets/js';

var files = {
	scripts: 	[
					'vendor/jquery/dist/jquery.js', 	
					'www/assets/scripts/plugins/**/*.js', 
					'www/assets/scripts/main.js', 

				]
};
 
 
// Compile Sass, autoprefix CSS3,
// and save to target CSS directory
gulp.task('css', function () {
	return gulp.src(lessDir + '/app.less')
		.pipe(less({ compress: true }).on('error', gutil.log))
		.pipe(autoprefix('last 10 version'))
		.pipe(gulp.dest(targetCSSDir))
		.pipe(notify('CSS minified'))
});

// Handle JavaScript compilation
gulp.task('js', function () {
	return gulp.src(files.scripts)
		// .pipe(cache(uglify(), {
		// 	key: makeHashKey,
		// 	// What on the result indicates it was successful
		// 	success: function (uglifiedFile) {
		// 		return uglifiedFile.uglify.success;
		// 	},
		// 	// What to store as the result of the successful action
		// 	value: function (uglifiedFile) {
		// 		// Will be extended onto the file object on a cache hit next time task is ran
		// 		return {
		// 			uglify: uglifiedFile.uglify
		// 		};
		// 	}
		// }))
		.pipe(debug())
		.pipe(concat('app.min.js'))
		.pipe(uglify({outSourceMap: true}).on('error', gutil.log))
        .pipe(gulp.dest(targetJSDir))
        .pipe(notify('JS minified'))	
});

// Handle JavaScript linting
gulp.task('lint', function() {
	return gulp.src(jsDir + '/**/*.js')
		.pipe(changed(targetJSDir))
		.pipe(debug())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))		
		.pipe(notify('JS Linted'));
}); 

// Keep an eye on Sass, Coffee, and PHP files for changes...
gulp.task('watch', function () {
	gulp.watch(lessDir + '/**/*.less', ['css']);
	gulp.watch(jsDir + '/**/*.js', ['lint', 'js']);
});
 
// What tasks does running gulp trigger?
gulp.task('default', ['lint', 'css', 'js', 'watch']);


function makeHashKey(file) {
  // Key off the file contents, jshint version and options
  return [file.contents.toString('utf8')].join('');
}