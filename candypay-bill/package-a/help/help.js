const app = getApp()
Page({
    data: {
        showBindedTip: false,
        verson: app.globalData.versionName
    },
    onLoad: function (options) {

    },
    onReady: function () {
      
    },
    onShow: function () {

    },
    showModal() {
        this.setData({
            showBindedTip: true
        })
    },
    hideModal() {
        this.setData({
            showBindedTip: false
        })
    },
})