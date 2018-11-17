/**
 * Created by sashkoboom on 17. 10. 2018.
 */
const gulp = require("gulp");
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const del = require('del');

gulp.task("watch", ['browserSync', 'babel'], function () {
    gulp.watch('app/*.div', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload);
    gulp.watch('app/styles/*.css', browserSync.reload);
    gulp.watch('index.html', browserSync.reload);
});

// gulp.task('build', function () {
//     return browserify({entries: './app/js/index.js', debug: true})
//         .transform("babelify", { presets: ["es2015"] })
//         .bundle()
//         .pipe(source('app.js'))
//         .pipe(gulp.dest('./dist/js'));
// });

gulp.task('browserSync', function(){
    browserSync.init({
        server:{
            baseDir: './'
        }
    })
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task("clean:dist", function(){
    return del.sync('dist');
});

gulp.task('scripts',  function() {
    return gulp.src([
        'node_modules/babel-polyfill/dist/polyfill.js',
        'app/js/*.js'
    ]).pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('compiled')) });

gulp.task('babel', () =>
    gulp.src('app/js/*.js')
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('dist'))
);

// gulp.task('build', function (callback){
//     runSequence('clean:dist', ['fonts', 'babel'], callback);
// } );


gulp.task('default', function(callback){
    runSequence(['browserSync', 'watch'], callback)
});

gulp.task("hello", () => {
    console.log("ciao sasha! <3")
});