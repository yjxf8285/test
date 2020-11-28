/*
 * @Author: Richard
 * @Date: 2018-11-28 17:35:12
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-22 10:20:02
 *  
 */
const util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        accountInfos: [],
        length: 0
    },
    onLoad(options) {

    },
    onShow() {
        this.getAccountList()
    },
    getAccountList() {
        let that = this
        app.api.getMerchantList({
            params: {
                idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                requestType:'TRANSICATION'
            },
            success(res) {
                let payload = res.payload || {}
                let accountInfos = payload.accountInfos || []
                accountInfos.forEach((item, i) => {
                    if (i == 0) {
                        item.def = true
                    } else {
                        item.def = false
                    }
                    item.brandName = util.getBrandName(item.brandCode)
                    item.statusName = util.transStatusType(item.status).name
                    item.fontColor = util.transStatusType(item.status).fontColor
                    item.bgColor = util.transStatusType(item.status).bgColor
                    // item.regionName = app.getRegionName(item.merchantRegion, 1)
                    // item.merchantDisplayName = util.interceptStr(item.merchantName, 25)
                })
                that.setData({
                    accountInfos
                })
            }
        })
    },
    setDefMerchant(e) {
        let that = this
        let item = e.currentTarget.dataset.item || {}
        let merchantId = item.merchantId || ''
        let accountInfos = this.data.accountInfos
        accountInfos.forEach(item => {
            if (item.merchantId == merchantId) {
                item.def = true
            } else {
                item.def = false
            }

        })
        this.setData({
            accountInfos
        })

        app.api.setDefMerchant({
            params: {
                merchantId
            },
            success(res) {
                // setTimeout(m => {
                //     that.gotoIndex()
                // }, 300)

            }
        })
    },
    gotoIndex() {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    gotoMechantInfo() {
        if (app.globalData.authType == 'AUTHED') {
            wx.navigateTo({
                url: '/package-a/complete-merchant-info/complete-merchant-info'
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