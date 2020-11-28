/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-05-27 11:16:03
 */
const app = getApp()
Page({
    data: {
        index: 0
    },
    onLoad: function (opt) {

    },
    onReady: function () {
        this.billsDetail = this.selectComponent("#bills-detail")
    },
    onShow: function () {
        this.billsDetail = this.selectComponent("#bills-detail")
        if (app.globalData.fromCardAccM) {
            this.setData({
                index: 1
            })
            app.globalData.fromCardAccM = false
            this.billsDetail.init() // 记得这里要刷新
        } else {
            this.setData({
                index: 0
            })
        }
    },
    tabMenu(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            index
        })
        // 每次切过来都要初始化
        if (this.data.index == 1) {
            this.billsDetail.init()
        }

    },
    onReachBottom() {
        if (this.data.index == 0) return
        if (!this.loading) {
            this.billsDetail.onscrollbottom()
        }
    },
})