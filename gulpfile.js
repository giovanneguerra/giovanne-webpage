//Variables
var gulp            =   require('gulp'),
    gutil           =   require('gulp-util'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    concat          =   require('gulp-concat'),
    autoprefixer    =   require('gulp-autoprefixer'),
    plumber         =   require('gulp-plumber'),
    shorthand       =   require('gulp-shorthand'),
    cssNano         =   require('gulp-cssnano'),
    cssComb         =   require('gulp-csscomb'),
    cssLint         =   require('gulp-csslint'),
    uglify          =   require('gulp-uglify'),
    rename          =   require('gulp-rename'),
    babel           =   require('gulp-babel'),
    uglify          =   require('gulp-uglify'),
    iife            =   require('gulp-iife'),
    clean           =   require('gulp-clean'),
    imagemin        =   require('gulp-imagemin'),
    svgo            =   require('gulp-svgo'),
    browserSync     =   require('browser-sync');

//Paths
var SASS_PATH       =   './assets/sass/**/*.scss';
var SCRIPTS_PATH    =   './assets/scripts/**/*.js';
var IMAGES_PATH     =   './assets/images/*.+(png|jpg|jpeg|gif|svg)';

//Destinations
var SASS_DEST       =   './public/stylesheets/';
var SCRIPTS_DEST    =   './public/scripts/';
var IMAGES_DEST     =   './public/images/';

//Tasks
//browser-sync
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "http://localhost:8000"
  });
});

//Reload
gulp.task('bs-reload', function () {
    browserSync.reload();
  });

//Clean
gulp.task('clean', function(){
    gutil.log(gutil.colors.bgBlue.white('Cleaning the public paths'));
    return gulp.src([SASS_DEST,SCRIPTS_DEST,IMAGES_DEST])
        .pipe(clean({force: true}))
});

//Sass
gulp.task('sass', function(){
    gutil.log(gutil.colors.bgMagenta.white('Sass has Started'));
    return gulp.src(SASS_PATH)
        .pipe(plumber({
            errorHandler: function(error){
                gutil.log(gutil.colors.magenta(error.message));
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({
            includePaths: require('node-reset-scss').includePath
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cssComb())
        .pipe(cssLint())
        .pipe(cssLint.formatter())
        .pipe(gulp.dest('./assets/stylesheets/'))
        .pipe(concat('main.css'))
        .pipe(shorthand())
        .pipe(cssNano())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(SASS_DEST))
        .pipe(browserSync.reload({stream:true}));
});

//JS
gulp.task('scripts', function(){
    gutil.log(gutil.colors.bgYellow.white('Scripts has started'));
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber({
            errorHandler: function(error){
                gutil.log(gutil.colors.yellow(error.message));
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        .pipe(iife())
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(SCRIPTS_DEST))
        .pipe(browserSync.reload({stream: true}));
});

//Images
gulp.task('images', function(){
  gutil.log(gutil.colors.bgGreen.white('Images has started'));
  return gulp.src(IMAGES_PATH)
  .pipe(plumber({
      errorHandler: function(error){
          gutil.log(gutil.colors.green(error.message));
          this.emit('end');
      }
  }))
  .pipe(svgo())
  .pipe(imagemin([
  	imagemin.gifsicle({interlaced: true}),
  	imagemin.jpegtran({progressive: true}),
  	imagemin.optipng({optimizationLevel: 5})
  ],
  {
    verbose: true
  }))
  .pipe(gulp.dest(IMAGES_DEST))
  .pipe(browserSync.reload({stream:true}));
});

//HTML
gulp.task('html', function(){
    gutil.log(gutil.colors.bgOrange.white('HTML has started'));
    return gulp.src(VIEWS_PATH)
    .pipe(plumber({
        errorHandler: function(error){
            gutil.log(gutil.colors.orange(error.message));
            this.emit('end');
        }
    }))
    .pipe(htmlmin())
    .pipe(gulp.dest(VIEWS_DEST))
    .pipe(browserSync.reload({stream:true}));
});

//Gulp
gulp.task('default', ['images','sass','scripts','browser-sync'], function(){
    gulp.watch(SASS_PATH, ['sass']);
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(IMAGES_PATH, ['images']);
    gulp.watch("*.html", ['bs-reload']);
});
