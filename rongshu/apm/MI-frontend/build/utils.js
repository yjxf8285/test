var fs = require('fs')
var ejs = require('ejs')
var path = require('path')
var archiver = require('archiver')
let deepAssign = require('deep-assign')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var config = require('./config')

exports.assetsPath = function(_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.copyFile = function(source, target, copyCallback) {
  var done = false;
  var readStream = fs.createReadStream(source);
  var writeStream = fs.createWriteStream(target);

  readStream.on('error', copyDone);
  writeStream.on('error', copyDone);

  writeStream.on('close', function() {
    copyDone(null);
  });

  readStream.pipe(writeStream);

  /**
   * Finish copying. Reports error when needed
   * @param [error] optional error
   */
  function copyDone(error) {
    if (!done) {
      done = true;
      copyCallback(error);
    }
  }
}

/**
 *  生成配置文件
 * @param {String} env 当前要生成的配置文件的环境变量
 * @param {String} target 将当前配置文件要生成到的目录
 * @param {String} extension defaultValue : json 要生成的配置文件的扩展名，目前支持json 和 js
 * @return {PromiseFunction} 返回生成文件后的Promise回调
 */
exports.generateConfigAsync = function(env, target, extension = 'json') {
  let baseConfig = require('../admin/config/base')
  let AppConfig = require('../admin/config/' + (env ? env : 'development'))
  let buildConfig = require('../admin/config/build')
  let tplPath = path.join(__dirname, './config/template.js')
  let config = deepAssign({}, baseConfig, AppConfig, buildConfig)
  config.env = env
  if (extension === 'json') {
    return this.generateJsonFileAsync(config, target)
  } else if (extension === 'js') {
    return new Promise((resolve, reject) => {
      fs.writeFile(target, `module.exports = ${JSON.stringify(config,null,2)}`, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  } 
}

/**
 * 生成JSON文件
 */
exports.generateJsonFileAsync = function(json, target) {
  return new Promise((resolve, reject) => {
    fs.writeFile(target, JSON.stringify(json, null, 2), function(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    });
  })
}
