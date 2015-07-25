var gulp        = require('gulp');
var changed = require('gulp-changed');
var deploy      = require('gulp-gh-pages');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var fileinclude = require('gulp-file-include');
var watch = require('gulp-watch');

var sitemap = require('gulp-sitemap');

// to include data from json
// var swig = require('gulp-swig');
// var data = require('gulp-data');
// var getJsonData = require('https://spreadsheets.google.com/feeds/cells/1bTuZdyAJaR8GW-Pa_PKCJjkGNhMdm12X3krLIaImRYo/1/public/values?alt=json');

//var getJsonData = function(file) {
//  return require('./examples/' + path.basename(file.path) + '.json');
//};





//var offre = require('./package.json')


// Minify & include html
gulp.task('mininclude', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './dist/';

  gulp.src(htmlSrc)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: './src/incl/'
      }))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

/**************** ASSETS *******************/
// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './dist/images';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});


// CSS minify
gulp.task('styles', function() {
  var cssSrc = './src/assets/css/**/*.css',
      cssDst = './dist/assets/css/';

  gulp.src([cssSrc])
  	.pipe(changed(cssDst))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDst));
});

// compress js
gulp.task('optijs', function() {
  var jsSrc = './src/assets/js/**/*.js',
      jsDst = './dist/assets/js';

  gulp.src(jsSrc)
  	.pipe(changed(jsDst))
    .pipe(uglify())
    .pipe(gulp.dest(jsDst));
});

// remaining
gulp.task('Assets', ['imagemin','styles','optijs'], function() {
  var ftSrc = './src/assets/**/*',
      ftDst = './dist/assets/';

  gulp.src(ftSrc)
  	.pipe(changed(ftDst))
    .pipe(gulp.dest(ftDst));
});

/**************** END ASSETS *******************/


gulp.task('Cname', function() {
  var ftSrc = './src/CNAME',
      ftDst = './dist/';

  gulp.src(ftSrc)
    .pipe(changed(ftDst))
    .pipe(gulp.dest(ftDst));
});


// build sitemap
gulp.task('sitemap', function () {
    gulp.src('dist/**/*.html')
        .pipe(sitemap({
            siteUrl: 'http://www.formatup.com'
        }))
        .pipe(gulp.dest('./dist'));
});

/** Push build to gh-pages */
gulp.task('deploy',['default', 'sitemap'], function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});




// default gulp task
gulp.task('default', ['mininclude', 'Assets','Cname', 'watchHtml','watchAssets','watchCname'], function() {
});

// watch, rebuild when anything changes
gulp.task("watchHtml", function() {
    watch("src/**/*.html", function() {
        gulp.start("mininclude");
    });
});

gulp.task("watchAssets", function() {
    watch("src/assets/**/*", function() {
        gulp.start("Assets");
    });
});

gulp.task("watchCname", function() {
    watch("src/CNAME", function() {
        gulp.start("Cname");
    });
});
