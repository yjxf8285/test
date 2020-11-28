/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-19 13:22:52
 */
// package-a/mine/account/account-pos/account-pos.js
const util = require('../../../../utils/util.js') //只能是相对路径
const app = getApp()
Page({
    /**
     * Page initial data
     */
    data: {
        merchant: {},
        showEditWindow: false,
        editLabeName: '',
        editMerchantName: '',
        editLabeSn: '',
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (opt) {
        if (opt.merchant != undefined) {
            let merchant = {}
            try {
                merchant = JSON.parse(decodeURIComponent(opt.merchant) || '{}')
            }
            catch (exception) {
                wx.showModal({
                    title: '数据错误',
                    content: '错误代码：' + opt.merchant,
                    showCancel: false,
                })
                console.log(exception)
                return
            }
            merchant.merchantDisplayName = merchant.merchantName
            this.setData({
                merchant: merchant
            })
        }
    },

    editLabel(e) {
        let item = e.currentTarget.dataset.item
        this.setData({
            editLabeSn: item.sn,
            editLabeName: item.label,
            editMerchantName: this.data.merchant.merchantName,
            showEditWindow: true
        })
    },
    postSetLabel() {
        if (this.data.editLabeName == '' || this.data.editLabeName == null) {
            wx.showModal({
                title: '错误',
                content: '请输入名称',
                showCancel: false,
            })
            return
        }
        let that = this
        let label = this.data.editLabeName
        let sn = this.data.editLabeSn
        app.api.setLabel({
            params: {
                sn,
                label
            },
            success(res) {
                that.setData({
                    showEditWindow: false
                })
                that.getMerchantListData()
            }
        })
    },
    setlabelinputval(e) {
        this.setData({
            editLabeName: e.detail.value
        })
    },
    cancelEidt() {
        this.setData({
            showEditWindow: false
        })
    },

    getMerchantListData() {
        let that = this
        app.api.getMerchantList({
            params: {
                idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                requestType:'USERCENTER'
            },
            success(res) {
                let payload=res.payload||{}
                let accountInfos = payload.accountInfos ||[]
                accountInfos.forEach(m => {
                    m.devices.forEach(mm => {
                        mm.originSourceType = 2
                        mm.mccName = app.getMccName(mm.vendorMcc)
                        mm.cityName = app.getRegionName(mm.vendorRegion, 1)
                        mm.merchantRegion = m.merchantRegion
                        mm.merchantName = m.merchantName
                        mm.merchantMcc = m.merchantMcc
                        mm.vendorName = util.interceptStr(mm.vendorName || '', 29)
                    })
                    if (m.merchantId == that.data.merchant.merchantId) {
                        m.regionName = app.getRegionName(m.merchantRegion, 1)
                        m.merchantDisplayName = that.data.merchant.merchantDisplayName
                        that.setData({
                            merchant: m
                        })
                    }
                })
                //如果pos列表为空就就是互联网用户
            }
        })
    }
})