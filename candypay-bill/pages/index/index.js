/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-05 16:51:50
 * @LastEditTime: 2020-05-08 16:35:18
 */
const app = getApp()

Page({
    data: {
        bannerIsShow: 0,
    },
    onLoad(opt) {
        this.init()
    },
    init() {
        this.getAdBannerStatus()
    },
    onShareAppMessage() {
    },
    // 是否显示广告位广告
    getAdBannerStatus() {
        app.api.bannerIsShow({
            success: res => {
                this.setData({
                    bannerIsShow: res.payload
                })
            }
        })
    },
    gotoAdPage() {
        wx.navigateTo({
            url: '/package-a/card-installments-ad/card-installments-ad'
        })
    },
    gotoChargeUp() {
        wx.navigateTo({
            url: '/package-a/charge-up/charge-up'
        })
    },
    addMerchant() {
        if (app.globalData.authType == 'AUTHED') {
            wx.navigateTo({
                url: '/package-a/complete-merchant-info/complete-merchant-info'
            })
        } else {
            this.gotoRealNameAuthenticationPage()
        }
    },
    transactionQuery() {
        // 如果是专业版用户可以不用实名认证
        if (app.globalData.authType == 'AUTHED' || !app.globalData.isGuestUser) {
            wx.navigateTo({
                url: '/package-a/transaction-query/transaction-query'
            })
        } else {
            this.gotoRealNameAuthenticationPage()
        }
    },
    deviceQuery() {
        if (app.globalData.authType == 'AUTHED' || !app.globalData.isGuestUser) {
            wx.navigateTo({
                url: '/package-a/bind-terminal-list/bind-terminal-list'
            })
        } else {
            this.gotoRealNameAuthenticationPage()
        }
    },
    limitIncrease() {
        // wx.navigateTo({
        //     url: '/package-a/receipt-amount/receipt-amount'
        // })
        // return
        if (app.globalData.authType == 'AUTHED' || !app.globalData.isGuestUser) {
            wx.navigateTo({
                url: '/package-a/receipt-amount/receipt-amount'
            })
        } else {
            
            this.gotoRealNameAuthenticationPage()
        }
    },
    gotoRealNameAuthenticationPage() {
        wx.showModal({
            title: '提示',
            content: '请先实名认证',
            success: (res) => {
                if (!res.confirm) return
                wx.navigateTo({
                    url: '/package-a/real-name-authentication/real-name-authentication'
                })
            }
        })
    }
})