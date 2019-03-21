var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');
var concat = require('gulp-concat');
var merge = require('merge-stream');
let webserver = require('gulp-webserver');

// spins up a live local web server to serve up root of project folder
// https://www.npmjs.com/package/gulp-webserver
gulp.task('webserver', function() {
    gulp.src('./')
      .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: "/index.htm"
      }));
});

// for transpiling ES2015 to ES5 via Babel
gulp.task('build', function(){

  // ./src/app.js is the entry point in your project folder (change it to as required)
  //var bundler = browserify('./src/app.js', { debug: true }).transform(babel);
  var bundler = browserify('./src/app.js', { debug: true })
    .transform(babel, {
        global: true,  
        // set ignore if any imported modules in node_modules give you trouble    
        //ignore: [/\/node_modules\/nameOfModuleHere\//], 
        presets: ["babel-preset-env"]
    });

  bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      // where transpiled JS is output
      .pipe(gulp.dest('./build'));

      console.log(">>> I am busy transpiling JS :)");
});

// for transpiling Sass to CSS
gulp.task('styles', function() {
    // transpile all sass files and concatenate together
    var scssStream = gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('scss-files.scss')
    );
    // concatenate all css together
    var cssStream = gulp.src(['sass/**/*.css','lib/**/*.css'])
        .pipe(concat('css-files.css')
    );
    // merge them all together
    merge(scssStream, cssStream)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./css/'));

    console.log(">>> I am busy transpiling and merging CSS :)");
});

// no need to use Watchify as gulp has gulp.watch built in (although not as efficient)
gulp.task('watch', function () {
  // watching all JS and Sass files
  gulp.watch('./src/**/*.js', ['build']);
  gulp.watch('./lib/**/*.js', ['build']);
  gulp.watch('sass/**/*.scss',['styles']);
  gulp.watch('sass/**/*.css',['styles']);
});

gulp.task('default', ['build','styles','webserver','watch']);