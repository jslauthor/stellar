var gulp  = require("gulp"),
    watch =	require("gulp-watch"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    streamify = require('gulp-streamify'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    jshintReporter = require('jshint-stylish'),
    sass  = require('gulp-sass'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    reactify = require("reactify"),
    babelify = require("babelify")
    browserify = require('browserify');

var paths = {
    src: ['./models/**/*.js', 'package.json'],
    scripts: ['src/js/**/*.js*'],
    css: 'src/scss/**/*css',
    images: 'src/img/**/*'
};

gulp.task('browserify', function f() {
    return browserify('./src/js/index.js')
        .transform(babelify)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./js'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src([paths.scripts, paths.src])
        .pipe(jshint())
        .pipe(jshint.reporter(jshintReporter));
});

gulp.task('libs', function() {
    return gulp.src("src/js/lib/**/*")
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        // Pass in options to the task
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('./img'));
});

gulp.task('sass', function () {
    return gulp.src(paths.css)
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['browserify', 'libs']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.css, ['sass']);
});

gulp.task('default', ['browserify', "libs", 'sass', 'images', 'watch']);