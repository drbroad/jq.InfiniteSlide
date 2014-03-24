/* --------------------------------------------------------*/
/*
	REQUIRED PACKAGES
*/
/* --------------------------------------------------------*/
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
 


/* --------------------------------------------------------*/
/*
	VARS
*/
/* --------------------------------------------------------*/ 
// Where do you store your Less files?
var lessDir = 'assets/less';

// Where do you store your JS files?
var jsDir = 'assets/scripts';
 
// Which directory should Sass compile to?
var targetCSSDir = 'assets/css';
 
// Which directory should CoffeeScript compile to?
var targetJSDir = 'assets/js';

// Where do you store your JS files?
var files 		= {
		scripts	:	[
						'assets/scripts/plugins/**/*.js', 
						'assets/scripts/main.js', 
					],
		vendor	:	[
						'vendor/jquery/dist/jquery.js',
						'vendor/jqueryui/ui/jquery.ui.widget.js',						
						'vendor/holderjs/holder.js'
					],				
};
	 
/* --------------------------------------------------------*/
/*
	CSS COLLECTIONS
*/
/* --------------------------------------------------------*/	  
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


/* --------------------------------------------------------*/
/*
	JS COLLECTIONS
*/
/* --------------------------------------------------------*/

// Handle JavaScript compilation
gulp.task('appJS', ['lint'],  function () {
	var src		= files.scripts;
	var name	= 'app.min.js';
	return buildJS(src, name, 'App');
});

// Handle JavaScript compilation
gulp.task('vendorJS', ['lint'],  function () {
	var src		= files.vendor;
	var name	= 'vendor.min.js';
	return buildJS(src, name, 'Vendor');
});

// Handle the js
var buildJS = function (src, name, type){
	return gulp.src(src)		
		.pipe(concat(name))
		.pipe(uglify({outSourceMap: true}))
		.pipe(gulp.dest(targetJSDir))		
		.pipe(notify(type + ' JS minified'))
		.on('error', gutil.log)		
}


/* --------------------------------------------------------*/
/*
	LINTING
*/
/* --------------------------------------------------------*/
// Handle JavaScript linting
gulp.task('lint', function() {
	return gulp.src(jsDir + '/**/*.js')
		.pipe(changed(targetJSDir))
		.pipe(debug())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))		
		.pipe(notify('JS Linted'));
}); 


/* --------------------------------------------------------*/
/*
	WATCH TASKS
*/
/* --------------------------------------------------------*/
// Keep an eye on Sass, Coffee, and PHP files for changes...
gulp.task('watch', function () {	
	gulp.watch(lessDir + '/**/*.less', ['css']);
	gulp.watch(jsDir + '/**/*.js', ['lint', 'appJS']);
	gulp.watch('vendor/**/*.js', ['lint', 'vendorJS']);
});
 
/* --------------------------------------------------------*/
/*
	DEFAULT TASK
*/
/* --------------------------------------------------------*/
// What tasks does running gulp trigger?
gulp.task('default', ['lint', 'css', 'appJS','vendorJS', 'watch']);