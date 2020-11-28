const app = getApp()
Page({
    data: {
        showBindedTip: false,
        verson: app.globalData.versionName
    },
    onLoad: function () {

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
    gotoIndex() {
        app.globalData.showIndexGuidePage = false
        wx.reLaunch({
            url: "/pages/index/index"
        })
    }
})