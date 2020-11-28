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
        carInfoData: [],
        cardCount: 0
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
        this.loadCardList()
    },
    inputName(e) {
        let val = e.detail.value || ''
        let merchant = this.data.merchant || {}
        merchant.name = val.trim()
        this.setData({ merchant })
    },
    loadCardList() {
        let that = this
        app.api.getCard({
            url: 'card/' + this.data.merchant.idCard,
            success(res) {
                res.payload.forEach(cardInfo => {
                    cardInfo.bankName = util.subBankName(cardInfo.bankName)
                    if (cardInfo.vendorName == null || cardInfo.vendorName == '') {
                        cardInfo.vendorName = '无'
                    }
                    cardInfo.cardDisplayNo = util.subCardNumber(cardInfo.cardNo)
                });
                res.payload.forEach(m => {
                    m.fullBankName = m.bankName
                })
                that.setData({
                    carInfoData: res.payload,
                    cardCount: res.payload.length
                })
            }
        })
    },
    putMember() {
        let idCard = this.data.merchant.idCard || ''
        let name = this.data.merchant.name || ''
        if (name) {
            app.api.updateMember({
                data: {
                    idCard,
                    name
                },
                success(res) {
                    wx.showModal({
                        title: '提示',
                        content: '成员编辑成功',
                        showCancel: false,
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '别名不能为空',
                showCancel: false,
            })
        }

    }
})