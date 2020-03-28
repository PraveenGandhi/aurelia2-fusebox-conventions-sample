const gulp = require('gulp');
var replace = require('gulp-replace');
const au2 = require('@aurelia/plugin-gulp').default;
const merge2 = require('merge2');
const del = require('del');
const temp_src = 'temp_src';

function buildAu2Conventions(src) {
    return gulp.src(src)
    .pipe(au2())
    .pipe(replace(/(import.*\s+from\s+['"].*)(\.html)(["'];)/g,"$1$2.js$3"));
}

function watch() {
    return gulp.watch('src/**/*', gulp.series(build));
}

function build() {
    return merge2(
            gulp.src('src/**/*.css'),
            buildAu2Conventions('src/**/*.ts'),
            buildAu2Conventions('src/**/*.html')
        )
        .pipe(gulp.dest(temp_src));
}

function clean() {
    return del(temp_src);
}

const run = gulp.series(clean, build, watch);
exports.default = run;
