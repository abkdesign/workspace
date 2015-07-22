var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    concat       = require("gulp-concat"),
    watch        = require("gulp-watch"),
    plumber      = require("gulp-plumber"),
    minify_css   = require("gulp-minify-css"),
    uglify       = require("gulp-uglify"),
    prefixer     = require("gulp-autoprefixer"),
	browserSync  = require("browser-sync"),
	typeScript   = require("gulp-typescript"),
    babel        = require("gulp-babel"),
    clean        = require("gulp-clean"),
	sourceMaps   = require("gulp-sourcemaps");

//------------------------------------------------------------

var dest_js = "js/build";
var dest_ts = "js/build";
var dest_css = "css";
var src_sass = "scss/**/*.scss";
var src_js = "js/dev/**/*.js";
var src_ts = "js/**/*.ts";
var src_scripts = "js/build/**/*.js";
var src_css = "css/*.css";

var indexFile = "index.html";
var base = {base: './'};
var dist = "./dist";
//------------------------------------------------------------
// SASS TO CSS
gulp.task('single', function(){
   return gulp.src('scss/application.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer('last 2 versions'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(dest_css))
    .pipe(minify_css())
    .pipe(gulp.dest(dest_css))
    .pipe(browserSync.stream());
});
// only save style sass
gulp.task('sass', function(){
   return gulp.src(src_sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer('last 2 versions'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(dest_css))
	.pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(dest_css))
    .pipe(browserSync.stream());
});
// Compile concat js
gulp.task('js', function(){
    return gulp.src(src_js)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(dest_js));
});

// Compile Typescript
gulp.task('typescript', function(){
	return gulp.src(src_ts)
		.pipe(plumber())
		.pipe(typeScript())
		.pipe(gulp.dest(dest_ts));
});
gulp.task('browser-sync',['sass'], function() {
    browserSync.init([src_sass], {
        server: {
            baseDir: "./"
        }
    });
});
// es6 -babel
gulp.task('babel',function(){
    return gulp.src(src_ts)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(dest_ts));
});
//clean
gulp.task('clean', function(){
    return gulp.src(dist, {read: false})
        .pipe(clean());
});

// WATCH tasks
gulp.task('watch', function(){

     //gulp.watch(src_js, ['js']);
     gulp.watch(src_sass,['sass']);
	 gulp.watch(src_ts,['typescript']);
     gulp.watch("*.html").on("change", browserSync.reload);
});

gulp.task('build', ['clean', 'single', 'js'], function(){
   return gulp.src([src_scripts, src_css, indexFile], base)
       .pipe(gulp.dest(dist));
});
// Watch default
gulp.task('default', ['sass', 'js','browser-sync'], function(){
    gulp.start('watch');
});
//-----------------------------------------------------------