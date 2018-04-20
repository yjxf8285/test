let fs = require('fs')
let path = require('path')

let nameList = []
function fileDisplay (filePath) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      // 遍历读取到的文件列表
      files.forEach(function (filename) {
        // 获取当前文件的绝对路径
        var filedir = path.join(filePath, filename)
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (error, stats) {
          if (error) {
            console.warn('获取文件stats失败')
          } else {
            var isFile = stats.isFile() // 是文件
            var isDir = stats.isDirectory() // 是文件夹
            if (isFile) {
              let newName = nameList.length + '.js'
              nameList.push(filename.replace('.js', ''))
              // console.log(filename, newName)
              fs.writeFileSync(path.join(__dirname, '/dist/' + newName), fs.readFileSync(filedir))
              console.log('replace ' + filedir + ' to ' + path.join(__dirname, '/dist/') + newName + ' -- ' + nameList.length)
              if (nameList.length === 363) {
                fs.writeFile(path.join(__dirname, '/index.json'), JSON.stringify(nameList), err => {
                  if (err) console.warn(err)
                  console.log('name list write done!')
                })
              }
            }
            if (isDir) {
              fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}

fileDisplay(path.join(__dirname, './src'))
