/**
 * Created by 晓帆 on 2/25 025.
 * gulp配置文件
 */
'use strict';
//引入插件
var del = require('del');
var connect = require('gulp-connect');
var Proxy = require('gulp-connect-proxy');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var sass = require('gulp-ruby-sass');
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var md5 = require("gulp-md5-plus");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var htmlmin = require('gulp-htmlmin');
var opts = {
    mainVersion: '1.0.0',//主版本号
    imgVersion: '1.0',//图片版本号
    allFileSrc: ['**/*.*'],
    srcDir: './src',
    buildDir: './build'
};
gulp.task('htmlmin', ['md5'], function () {
    return gulp.src(opts.buildDir + '/html/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(opts.buildDir + '/html'))
});
//
gulp.task("webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task("server:dev", function () {
    connect.server({
        root: "build",
        port: 8000,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});
gulp.task("webpack:build", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});
gulp.task('build', function (cb) {
    return gulp.src('/src')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('/build'));
});
//gulp.task('scss', function () {
//    return gulp.src(opts.srcDir+'/css/**/*.scss')
//        .pipe(sass())
//        .pipe(gulp.dest(opts.buildDir+'/css'));
//});
gulp.task('html', ['copy:html'], function () {
    gulp.src(opts.buildDir + '/*.html')
        .pipe(livereload());
});
//gulp.task('scripts', function () {
//    gulp.src(opts.srcDir + '/*.html')
//        .pipe(webpack(webpackConfig))
//        .pipe(livereload());
//});
gulp.task('watch', function () {
    livereload.listen();
    //gulp.watch(opts.buildDir + '/**/*.html', ['html']);
    gulp.watch(opts.srcDir + '/**/*.html', ['html']);
    //gulp.watch(opts.srcDir + '/css/**/*.scss', ['scss']);
    //gulp.watch(opts.srcDir + '/js/**/*.js', ['scripts']);
    //gulp.watch('src/img/**/*', ['images']);
});
gulp.task('copy:html', function (cb) {
    gulp.src([
            //opts.srcDir + opts.allFileSrc,
            //'./src/index.html',
            './src/**/*.html',
            '!**/_variable.scss',
            '!**/config.js',
            '!**/*.css',
            '!**/*.map'
        ])
        .pipe(gulp.dest(opts.buildDir))
        .on('finish', cb);

});
//gulp.task('copy:css', function (cb) {
//    gulp.src([
//            //opts.srcDir + opts.allFileSrc,
//            './src/css/**/*.*',
//            '!**/_variable.scss',
//            '!**/config.js',
//            '!**/*.css',
//            '!**/*.map'
//        ])
//        .pipe(gulp.dest(opts.buildDir+'/css'))
//        .on('finish', cb);
//
//});
gulp.task('md5', ['replace'], function (done) {
    gulp.src(opts.buildDir+'/js/*.js')
        .pipe(md5(10, opts.buildDir+'/**/*.html'))
        .pipe(gulp.dest(opts.buildDir+'/js'))
        .on('end', done);
});
gulp.task('replace', function () {
    //var mainV = gulp.src([opts.srcDir + 'js/config.js'])
    //    .pipe(plugins.replace(/versions: '(\d\.){2,}\d',/, "versions: '" + opts.mainVersion + "',"))
    //    .pipe(plugins.replace(/baseDir: '(\w)\/',/, "baseDir: '" + opts.buildDir + "',"))
    //    .pipe(gulp.dest(opts.buildDir + 'js'));

    //var imgV = gulp.src([opts.srcDir + 'css/core/_variable.scss'])
    //    .pipe(plugins.replace(/\$versions: (\d\.){1,}\d;/, "$versions: " + opts.imgVersion + ";"))
    //    .pipe(gulp.dest(opts.buildDir + 'css/core/'));
    var htmlV = gulp.src([opts.srcDir + '/**/*.html'])
        .pipe(replace('http://localhost:8080/', '/'))
        .pipe(gulp.dest(opts.buildDir));
    return htmlV;
    //return merge(mainV, htmlV);
});
gulp.task('clean', function (cb) {
    del([opts.buildDir], cb);
});
gulp.task('default', ['server:dev', 'copy:html', 'watch']);
gulp.task('log', function () {
    console.info(plugins.merge)
});