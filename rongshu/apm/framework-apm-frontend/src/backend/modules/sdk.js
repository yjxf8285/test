const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
module.exports = app => {
  return {
  /**
   * 生成sdk文件
   * @param fileName 文件名
   * @param varObj 文件内容的变量
   */
    renderFiles(fileName, varObj) {
      // sdk模板路径
      let tplPath = path.join(__dirname, '/../sdktpl/webpp.html')
      // sdk存放的路径
      let outputDirectory = app.config.sdkSrc
      let sdkFilename = fileName + '.js'
      let outputFilePath = path.join(__dirname, '/../../', outputDirectory)
      // 模板默认变量
      let tplData = Object.assign({
        showLog: '',
        openTracing: '',
        transFrequency: '',
        apiHost: '',
        agentId: '',
        tierId: '',
        appId: ''
      }, varObj)
      ejs.renderFile(tplPath, tplData, function(err, text) {
        function writeSdk() {
          fs.writeFile(outputFilePath + sdkFilename, text, {
            encoding: 'utf8'
          }, function(err) {
            err ? console.error(err) : console.log('render sdk file success:', outputFilePath + sdkFilename)
          })
        }

        if (err) {
          console.log(err)
        } else {
          fs.readdir(outputFilePath, (err, files) => {
            if (err) {
              fs.mkdir(outputFilePath, writeSdk)
            } else {
              writeSdk()
            }
          })
        }
      })
    }
  }
}
