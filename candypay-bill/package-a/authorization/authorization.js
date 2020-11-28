/*
 * @Author: Liuxiaofan 
 * @Date: 2018-08-13 17:48:54 
 * @Last Modified by: Hu
 * @Last Modified time: 2018-10-23 17:27:31
 */

import NaviCtrl from '../../service/NaviController'

const app = getApp()
Page({
    data: {
        swiperItemCurrent: 0,
        agreement:1,
        callbackId: undefined
    },
    onLoad(opt) {
        let guidepageindex = wx.getStorageSync('guidepageindex')||0
        this.setData({
            swiperItemCurrent: guidepageindex
        })
        if (opt.id != undefined) {
            this.setData({
                callbackId: opt.id
            })
        }
        if (opt.statusCode == 401) {
            wx.showModal({
                title: '提示',
                content: '您的身份信息已过期，请重新授权登录！',
                showCancel: false
            })
        }
    },
    swiperChange({ detail }) {
        wx.setStorageSync('guidepageindex', detail.current)
    },
    getUserInfo(res) {
        let that = this
        wx.getUserInfo({
            success: function (res) {
                if (that.data.callbackId != undefined && that.data.callbackId != null) {
                    NaviCtrl.wxRelaunchPageFinish(that.data.callbackId, res)
                }
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            },
            fail: function () {
                console.log('拒绝授权！')
            }
        })

    },
    gotoUserAgreement() {
        wx.navigateTo({
            url: '/package-a/user-agreement/user-agreement'
        })
    },
    switchAgreement() {
        this.setData({
            agreement: !this.data.agreement
        })
    }
})