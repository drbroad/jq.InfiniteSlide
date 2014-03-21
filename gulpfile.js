var gulp		=	require('gulp');
var gutil		=	require('gulp-util');
var notify		=	require('gulp-notify');
var less		=	require('gulp-less');
var autoprefix	=	require('gulp-autoprefixer');
var jshint		=	require('gulp-jshint');
var rename		=	require('gulp-rename');
var changed		=	require('gulp-changed');
var cache		=	require('gulp-cached');
var minifyCSS	=	require('gulp-minify-css');
var uglify		=	require('gulp-uglify');
var concat		=	require('gulp-concat');
var debug		=	require('gulp-debug');
var exec		=	require('child_process').exec;
var sys			=	require('sys');
 
 
// Where do you store your Less files?
var lessDir = 'www/assets/less';

// Where do you store your JS files?
var jsDir = 'www/assets/scripts';
 
// Which directory should Sass compile to?
var targetCSSDir = 'www/assets/css';
 
// Which directory should CoffeeScript compile to?
var targetJSDir = 'www/assets/js';

// Where do you store your JS files?
	var files 		= {
			scripts	:	[
							'www/assets/scripts/plugins/**/*.js', 
							'www/assets/scripts/main.js', 
						],
			vendor	:	[
							'vendor/jquery/dist/jquery.js',
							'vendor/jqueryui/ui/jquery.ui.widget.js',						
							'vendor/holderjs/holder.js'
						],				
	};
	 
 
// Compile Sass, autoprefix CSS3,
// and save to target CSS directory
gulp.task('css', function () {
	return gulp.src(lessDir + '/app.less')
		.pipe(less({ compress: true }).on('error', gutil.log))
		.pipe(autoprefix('last 10 version'))
		.pipe(rename("styles.min.css"))
		.pipe(gulp.dest(targetCSSDir))
		.pipe(notify('CSS minified'))
});

// Handle JavaScript compilation
gulp.task('js', ['lint'], function () {
	return gulp.src(files.scripts)
		.pipe(debug())
		.pipe(concat('app.min.js'))
		.pipe(uglify({outSourceMap: true}))
		.pipe(gulp.dest(targetJSDir))		
        .pipe(notify('JS minified'))
        .on('error', gutil.log)	
});


// Handle JavaScript compilation
gulp.task('vendorJS', ['lint'],  function () {
	return gulp.src(files.vendor)
		.pipe(debug())
		.pipe(concat('vendor.min.js'))
		.pipe(uglify({outSourceMap: true}))
		.pipe(gulp.dest(targetJSDir))		
		.pipe(notify('Vendor JS minified'))
		.on('error', gutil.log)	
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
	gulp.watch('vendor/**/*.js', ['lint', 'vendorJS']);
});
 
// What tasks does running gulp trigger?
gulp.task('default', ['lint', 'css', 'js','vendorJS', 'watch']);