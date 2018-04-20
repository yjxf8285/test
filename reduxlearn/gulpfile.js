/**
 * Created by liuxiaofan on 2017/1/4.
 */
/* eslint-disable import/no-extraneous-dependencies */
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const del = require('del');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const exec = require('child_process').exec;//exec 是 Node 中的原生方法，用于执行 shell 命令

const paths = {
    allSrcJs: 'src/**/*.js?(x)',
    serverSrcJs: 'src/server/**/*.js?(x)',
    sharedSrcJs: 'src/shared/**/*.js?(x)',
    clientEntryPoint: 'src/client/app.js',
    gulpFile: 'gulpfile.js',
    webpackFile: 'webpack.config.js',
    libDir: 'lib',
    distDir: 'dist',
};

gulp.task('clean', () => {
    return del(paths.libDir);
});

gulp.task('build', ['clean'], () => {
    return gulp.src(paths.allSrcJs)
        .pipe(babel())
        .pipe(gulp.dest(paths.libDir));
});
gulp.task('lint', () => {
    return gulp.src([
        paths.allSrcJs,
        paths.gulpFile,
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('main', ['clean'], () =>
    gulp.src(paths.clientEntryPoint)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.distDir))
);

gulp.task('watch', () => {
    gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);