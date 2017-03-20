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
    browserSync     =   require('browser-sync');
//Paths
var sassPath = './assets/sass/**/*scss';

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
    return gulp.src(sassPath)
        .pipe(plumber({
            errorHandler: function(error){
                gutil.log(gutil.colors.red(error.message));
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./assets/stylesheets/'))
        .pipe(concat('main.css'))
        .pipe(cssNano())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./public/stylesheets/'))
        .pipe(browserSync.reload({stream:true}));;
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch(sassPath, ['sass']);
    gulp.watch("*.html", ['bs-reload']);
});
