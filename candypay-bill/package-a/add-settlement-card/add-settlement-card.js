/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-28 15:18:13
 */
//6214857175506445
const app = getApp()
import validate from '../../utils/validate.js'
import util from '../../utils/util.js'
Page({
    data: {
        name: '',
        idCard: '',
        customerNo: '', // 商编
        merchantName: '', //添加商户成功之后接口返回的商户名称
        createTime: '',// 添加商户成功之后接口返回的时间
        cardNo: '',
        bankName: '',
        bankCode: '',
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        vCode: '',
        randomCode: ''
    },
    onLoad: function (options) {
        let p = decodeURIComponent(options.params || '')
        let params = {}
        try {
            params = JSON.parse(p || '{}')
        }
        catch (exception) {
            wx.showModal({
                title: '数据错误',
                content: '错误代码：' + p,
                showCancel: false,
            })
            console.log(exception)
            return
        }
        let customerNo = params.customerNo || ''
        let merchantId = params.customerNo || ''
        let merchantName = params.fullName || ''
        let createTime = params.createTime || ''
        this.setData({
            randomCode: util.randomCode(4),
            customerNo,
            merchantId,
            merchantName,
            createTime,
            name: app.globalData.name || '',
            idCard: app.globalData.idCard || '',
        })
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onRegionSelect({ detail }) {
        this.setData({
            provinceName: detail.provinceName,
            provinceId: detail.provinceId,
            cityName: detail.cityName,
            cityId: detail.cityId
        })
    },
    setCardNo(e) {
        this.setData({
            cardNo: e.detail.value,
            bankName: '',
        })
    },
    setVcode(e) {
        this.setData({
            vCode: e.detail.value
        })
    },
    changeCode() {
        this.setData({
            randomCode: util.randomCode(4)
        })
    },
    getBankName(e) {
        let cardNo = this.data.cardNo || ''
        //拿到卡号之后本地进行一次luna验证
        if (validate.luhnCheck(cardNo)) {
            this.getBankInfo(cardNo)
        } else {
            util.showToast('请输入正确的卡号!')
            this.setData({
                bankName: '',
                cardName: '',
                cardNo
            })
        }
    },
    getBankInfo(cardNo = '') {
        let that = this
        app.api.getBankInfo({
            data: {
                cardNo,
                type: 'ISHUA'
            },
            success(res) {
                let payload = res.payload || {}
                if (payload.providerCode) {
                    if (res.payload.cardType == 'DEBIT') {
                        that.setData({
                            bankName: payload.agencyName,
                            bankCode: payload.providerCode,
                            cardName: payload.cardName,
                            cardNo,
                            isCreditCard: true
                        })
                    }
                    else {
                        that.setData({
                            bankName: '',
                            cardName: '',
                            isCreditCard: false
                        })
                        setTimeout(m => {
                            util.showToast('该卡片不是借记卡，请使用借记卡!')
                        }, 800)
                    }
                } else {
                    setTimeout(m => {
                        util.showToast('此银行暂不支持!')
                    }, 800)
                }

            }
        }, res => {
            that.setData({
                bankName: '',
                cardName: '',
            })
            util.showToast(res.data.payload)
        })
    },
    checkInputRule() {
        if (this.data.cardNo == '') {
            util.showToast('请输入结算卡号!')
            return false
        }
        if (this.data.bankName == '') {
            util.showToast('请识别开户行!')
            return false
        }
        if (this.data.cityId == '') {
            util.showToast('请选择开户省市!')
            return false
        }
        if (this.data.vCode == '') {
            util.showToast('请输入验证码!')
            return false
        }
        if (this.data.vCode != this.data.randomCode) {
            util.showToast('验证码错误!')
            return false
        }

        return true
    },
    submit() {
        let that = this
        if (!this.checkInputRule()) return
        let data = this.data
        let province = data.provinceName
        let city = data.cityName

        app.api.saveCustomerSettleCard({
            data: {
                customerNo: data.customerNo,
                ownerId: data.customerNo,
                bankAccountName: data.name,
                bankAccountNo: data.cardNo,
                bankCode: data.bankCode,
                bankName: data.bankName,
                province,
                city,
                lefuAreaCode: data.cityId
                // lefuAreaCode: '1101'
            },
            success(res) {
                that.gotoNextPage()
            }
        })
    },
    gotoNextPage() {
        let item = this.data || {}
        item.sourcePage = 'addsettlement' //页面来源
        let params = encodeURIComponent(JSON.stringify(item))
        wx.reLaunch({
            url: '/package-a/bind-terminal-detail/bind-terminal-detail?params=' + params
        })
    }
})