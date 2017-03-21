var gulp            =   require('gulp'),
    gutil           =   require('gulp-util'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    concat          =   require('gulp-concat'),
    autoprefixer    =   require('gulp-autoprefixer'),
    plumber         =   require('gulp-plumber'),
    cssNano         =   require('gulp-cssnano'),
    uglify          =   require('gulp-uglify'),
    rename          =   require('gulp-rename'),
    babel           =   require('gulp-babel'),
    uglify          =   require('gulp-uglify'),
    iife            =   require('gulp-iife'),
    browserSync     =   require('browser-sync');
//Paths
var SASS_PATH       =   './assets/sass/**/*.scss';
var SCRIPTS_PATH    =   './assets/scripts/**/*.js';

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
  });

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
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))        
        .pipe(gulp.dest('./assets/stylesheets/'))
        .pipe(concat('main.css'))
        .pipe(cssNano())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/stylesheets/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function(){
    gutil.log(gutil.colors.bgYellow.white('Script has started'));
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
        .pipe(iife())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/scripts/'))
        .pipe(browserSync.reload({stream: true}));
})

gulp.task('default', ['browser-sync'], function(){
    gulp.watch(SASS_PATH, ['sass']);
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});
