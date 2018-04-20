require('./check-versions')()
var moment = require('moment')
var shell = require('shelljs')
var utils = require('./utils')
var common = require('../admin/runtime/App/Utils')
process.env.NODE_ENV = 'production'

var buildEnv = process.argv[2] || 'development'

if (!shell.which('cnpm')) {
  console.warn('构建当前项目需要安装cnpm,可使用 npm install -g cnpm --registry=https://registry.npm.taobao.org 命令进行安装');
  shell.exit(1);
  return
}

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('./config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()
var buildDirectory = path.join(config.build.publicRoot)
rm(buildDirectory, err => {
  if (err) throw err
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    //根据package.json生成生产环境的package.json，去除掉其中的devDependencies
    var packageJson = require('../package.json')
    var pm2Json = require('../pm2.json')
    pm2Json.apps[0].script = 'be/index.js'
    packageJson = JSON.parse(JSON.stringify(packageJson))
    delete packageJson.devDependencies
    //var zipName = `apmmi-${buildEnv}-${moment().format('YYYY-MM-DD HH:mm:ss')}.zip`
    var zipName = `mapm.zip`
    Promise.all([
        // 生成package.json
        utils.generateJsonFileAsync(packageJson, path.resolve(config.build.publicRoot, './package.json')),
        // 生成APP运行时需要的pm2配置文件
        utils.generateJsonFileAsync(pm2Json, path.resolve(config.build.publicRoot, './pm2.json')),
        // 生成APP运行时需要的配置文件
        utils.generateConfigAsync(buildEnv, path.resolve(config.build.publicRoot, './config.json'), 'json'),
        // 删除开发环境对应的配置文件
        rmAsync(path.join(config.build.runtimeRoot, './config')),
        rmAsync(path.join(config.build.runtimeRoot, './package.json'))
      ])
      .then(function() {
        console.log(chalk.cyan('package.json copy complete.\n'))
        console.log(chalk.cyan('config.js generated complete.\n'))
        console.log(chalk.cyan('dev config deleted.\n'))
        console.log(chalk.cyan('runtime package.json deleted.\n'))
        // 进入构建目录，执行cnpm install
        return new Promise((resolve, reject) => {
          shell.cd(path.join(config.build.publicRoot))
          if (shell.exec('cnpm install').code !== 0) {
            console.log(chalk.red('cnpm install executed error.\n'))
            reject(new Error('cnpm install executed error.\n'))
          } else {
            console.log(chalk.cyan('cnpm install success.\n'))
            resolve(null)
          }
        })
      })
      .then(function() {
        console.log('build complete.')
        // common.zipFolderAsync(config.build.publicRoot, config.build.zipRoot, zipName)
        //   .then(function() {
        //     console.log(chalk.cyan(`zip completed: ${zipName}\n`))
        //   })
      })
      .catch(ex => {
        console.error(ex)
      })
  })
})

function rmAsync(directory) {
  return new Promise((resolve, reject) => {
    rm(directory, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
