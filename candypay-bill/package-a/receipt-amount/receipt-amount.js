/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-27 14:12:07
 */

const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        // totalLimitAmount: 0, //总额度
        // accountLength: 0,
        accountList: []
    },
    onShow: function (options) {
        this.init()
    },
    init() {
        this.getMerchantList()
    },
    getMerchantList() {
        app.api.getMerchantList({
            params: {
                idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                requestType: 'UPGRADE'
            },
            success: res => {
                let data = res.payload || {}
                let accountList = data.accountInfos || []
                // let accountLength = accountList.length
                // let totalLimitAmount = util.toNumbers(data.totalLimitAmount)
                this.setData({
                    accountList: this.formatAccountList(accountList),
                    // accountLength,
                    // totalLimitAmount
                })
            }
        })
    },
    formatAccountList(accountList) {
        accountList.forEach(account => {
            account.showSn = false
            account.currentLimitStr = util.toNumbers(account.currentLimit || 0)
            account.merchantRegionName = app.getRegionName(account.merchantRegion, true)
            account.devices.forEach(device => {
                device.hideSn = util.hideSnNumber(device.sn)
            })
        })
        return accountList
    },
    gotoCreditCardAuthentication(e) {
        let item = e.currentTarget.dataset.item
        let merchantId = item.merchantId || ''
        let name = item.name || ''
        let idCard = item.idCard || ''
        wx.navigateTo({
            url: "/package-a/creditcard-authentication/creditcard-authentication?merchantId=" + merchantId + "&pageSource=amount&name=" + name + "&idCard=" + idCard
        })
    }
})