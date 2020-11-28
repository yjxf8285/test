/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-05 16:51:50
 * @LastEditTime: 2019-11-06 15:31:23
 */
const app = getApp()

Page({
    data: {
        swiperItemCurrent: 2
    },
    onLoad(opt) {
    },
    getUserInfo(res) {
        let that = this
        wx.getUserInfo({
            success: function (res) {
                if (that.data.callbackId != undefined && that.data.callbackId != null) {
                    NaviCtrl.wxRelaunchPageFinish(that.data.callbackId, res)
                }
                that.gotoIndex()
            },
            fail: function () {
                console.log('拒绝')
            }
        })

    },
    gotoIndex() {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    }
})