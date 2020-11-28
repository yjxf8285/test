/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-10 16:35:08
 */
const app = getApp()
// 初始化签名变量，放在 Page 前
var content = null;
var touchs = [];
Page({
  date: {
    tempFilePath: ''
  },
  onLoad() {
    // this.setData({
    //   tempFilePaths: '../../image/icons/icon_pos_mode_card_read@2x.png'
    // })

    this.postTest()
    // wx.showModal({
    //     title: '提示',
    //     content: '这是一个模态弹窗',
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
  },
  saveAutograph() {
    let that = this
    this.selectComponent("#autograph").saveClick(function (tempFilePath) {
      console.log('autograph path', tempFilePath);

      const uploadTask = wx.uploadFile({
        url: 'http://localhost:8888/miniprogram/api.php', //仅为示例，非真实的接口地址
        filePath: tempFilePath,
        name: 'file',
        success(res) {
          //json字符串 需用JSON.parse 转
        }
      })
      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    })
  },
  clearCanvas() {
    this.selectComponent("#autograph").clearClick()
  },
  onPageScroll(scrollTop) {
    // console.info(scrollTop)
  },
  scroolTo() {
    const query = wx.createSelectorQuery()
    query.select('#abc').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
     
      res[0].top       // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      wx.pageScrollTo({
        scrollTop: res[0].top
      })
    })


  },
  submit() {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'cutImage',
      fileType: 'jpg',
      destWidth: 1920,
      destHeight: 1080,
      success: function (res) {
        //打印图片路径
        // console.info('canvasToTempFilePath:', res.tempFilePath)
        // //设置保存的图片
        that.setData({
          tempFilePath: res.tempFilePath
        })
        wx.getImageInfo({
          src: res.tempFilePath,
          success(res) {
            console.log('图片信息', res)
          }
        })
        that.uploadImg(res.tempFilePath)
      },
      fail(res) {
        console.log('保存失败', res)
      }
    })

  },
  uploadImg: function (filePath) {
    wx.uploadFile({
      url: 'http://localhost:8888/miniprogram/api.php', //仅为示例，非真实的接口地址
      filePath,
      name: 'file',
      success(res) {
        //json字符串 需用JSON.parse 转
      }
    })
    // var that = this;
    // wx.chooseMessageFile({
    //   count: 1,
    //   type: 'file',
    //   success(res) {
    //     // var filename = res.tempFiles[0].name
    //     // console.info(filename);
    //     // that.setData({ filename: filename });

    //     console.log(res.tempFiles[0].path)

    //   }
    // });

  },
  postTest() {

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  cutImage(tempFilePaths) {
    let that = this
    const ctx = wx.createCanvasContext('cutImage')
    ctx.drawImage(tempFilePaths[0],0,0)
      // 登录状态下不会出现这行文字，点击页面右上角一键登录)
    ctx.draw()

  },
  selectImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            console.log('图片信息', res)
          }
        })
        that.cutImage(tempFilePaths)
        // that.setData({
        //   tempFilePaths
        // })
      }
    })
  },
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.tempFilePaths,
      // filePath: '/image/icons/icon_pos_mode_card_read@2x.png',
      success(res) {
      },
      fail(res) {
      }
    })
  }

})