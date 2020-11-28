/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2019-11-07 17:37:07
 */

const app = getApp()
import util from '../../utils/util.js'
import validate from '../../utils/validate.js'
let countrange = 59
let count = countrange
Page({
    data: {
        merchantId: '',
        name: '',
        idCard: '',
        cardNo: '',
        mobile: '',
        code: '',
        bankName: '',
        cardName: '',
        isCreditCard: false,
        getVerifyCodeTxt: '获取验证码',
        vcodeBtnDisable: false,
        supplementData: {} // after the increase credit limit, verify API can response the data used to display the particular information in the perfect page 
    },
    onLoad: function (opt = {}) {
        let merchantId = opt.merchantId || ''
        this.setData({
            merchantId
        })
    },
    setName(e) {
        let name = this.data.name
        if (validate.checkChineseName(e.detail.value)) {
            name = e.detail.value
        }
        this.setData({ name })
        // this.setData({
        //     name: e.detail.value,
        // })
    },
    setIdCard(e) {
        this.setData({
            idCard: e.detail.value,
        })
    },
    setCardNo(e) {
        this.setData({
            cardNo: e.detail.value,
            bankName: '',
        })
    },
    getBankName(e) {
        let cardNo = this.data.cardNo || ''
        //拿到卡号之后本地进行一次luna验证
        if (validate.luhnCheck(cardNo)) {
            this.getCardBin(cardNo)
        } else {
            util.showToast('请输入正确的卡号!')
            this.setData({
                bankName: '',
                cardName: '',
                cardNo
            })
        }
    },
    getCardBin(cardNo = '') {
        let that = this
        app.api.getCardBin({
            data: {
                cardNo,
                type: 'ISHUA'
            },
            success(res) {
                if (res.payload.cardType == 'CREDIT') {
                    that.setData({
                        bankName: util.subBankName(res.payload.bankName),
                        cardName: res.payload.cardName,
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
                        util.showToast('该卡片不是信用卡，请使用信用卡!')
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
    setMobile(e) {
        this.setData({
            mobile: e.detail.value,
        })
    },
    setCode(e) {
        this.setData({
            code: e.detail.value,
        })
    },
    getCreditcardVerifyCode() {
        let that = this
        let mobile = that.data.mobile
        let merchantId = that.data.merchantId
        let cardNo = that.data.cardNo

        if (this.data.vcodeBtnDisable) {
            return
        }
        if (!validate.luhnCheck(cardNo)) {
            util.showToast('请输入正确的卡号')
            return
        }
        let tailCardNo = cardNo.substring(cardNo.length - 4)
        if (!validate.isPhoneAvailable(mobile)) {
            util.showToast('请输入正确的手机号码')
            return
        }

        app.api.getCreditcardVerifyCode({
            data: {
                merchantId,
                mobile,
                tailCardNo
            },
            success() {
                that.countDown()
            }
        })
    },
    countDown() {
        let that = this
        if (count == 0) {
            that.setData({
                getVerifyCodeTxt: '获取验证码',
                vcodeBtnDisable: false
            })
            count = countrange
            return
        }

        that.setData({
            vcodeBtnDisable: true,
            getVerifyCodeTxt: '重新获取(' + count + 's...)',
        })

        setTimeout(function () {
            count--
            that.countDown()
        }, 1000)
    },
    creditcardVerify(cb) {
        let that = this
        app.api.creditcardVerify({
            data: {
                bankName: that.data.bankName,
                cardNo: that.data.cardNo,
                merchantId: 86101201522,
                merchantId: that.data.merchantId,
                source: 'KAISHUA',
                tag: 0,
                idCard: that.data.idCard,
                mobile: that.data.mobile,
                name: that.data.name,
                code: that.data.code
            }, success(res) {
                cb && cb(res)
            }
        }
            //  ,res => {
            //     // util.showToast('请输入姓名!')
            // }
        )
    },
    canBeSubmit() {
        let that = this
        let name = that.data.name,
            idCard = that.data.idCard,
            cardNo = that.data.cardNo,
            mobile = that.data.mobile,
            code = that.data.code;


        if (!name) {
            util.showToast('请输入姓名!')
            return false
        }
        if (name.length < 2) {
            util.showToast('姓名至少2个字!')
            return false
        }
        if (!idCard) {
            util.showToast('请输入身份证号!')
            return false
        }
        if (!validate.isIdCardNo(idCard)) {
            util.showToast('请输入正确的身份证号码!')
            return false
        }
        if (!cardNo) {
            util.showToast('请输入银行卡号!')
            return false
        }
        if (!this.data.isCreditCard) {
            util.showToast('请填写正确的信用卡号!')
            return
        }
        if (!mobile) {
            util.showToast('请输入银行预留手机号!')
            return false
        }
        if (!validate.isPhoneAvailable(mobile)) {
            util.showToast('请输入正确的手机号码')
            return
        }
        if (!code) {
            util.showToast('请输入验证码!')
            return false
        }
        if (!Number(code)) {
            util.showToast('验证码格式不正确!')
            return false
        }
        if (code.length != 6) {
            util.showToast('验证码长度不正确!')
            return false
        }
        return true
    },
    complete() {
        let that = this
        let canBeSubmit = this.canBeSubmit()
        if (canBeSubmit) {
            this.creditcardVerify(() => {
                util.showToast('提额成功!')
                setTimeout(function () {
                    that.gotoReceiptAmount()
                }, 1000)
            })
        }
    },
    gotoReceiptAmount() {
        wx.navigateBack({
            url: "/package-a/receipt-amount/receipt-amount"
        })
    },
    gotoCrediCardPerfect() {
        // let supplementData = {
        //     arrears: 330,
        //     availableLimit: null,
        //     bankName: "北京银行",
        //     cardNo: "6221636781859534",
        //     closingDate: 22,
        //     creditLimit: 220,
        //     currClosingDate: null,
        //     currRepaymentDate: null,
        //     currentRepayment: null,
        //     debt: null,
        //     debtScale: null,
        //     dueDate: null,
        //     dueInteval: 22,
        //     freeInteval: null,
        //     groupId: 385,
        //     groupName: "北京银行",
        //     name: "银联标准贷记卡",
        //     nextRepaymentInterval: null,
        //     operateEnable: false,
        //     shareAmountEnabled: false,
        //     shareBillEnabled: false,
        //     type: "CREDIT",
        //     vendorEnabled: false,
        //     vendorMcc: null,
        //     vendorName: null,
        //     vendorRegion: null,
        //     vendorType: "DEFAULT"
        // }


        // this.setData({
        //     supplementData
        // })
        // let params = encodeURIComponent(JSON.stringify(this.data))
        // wx.navigateTo({
        //     url: '/package-a/credit-card-perfect/credit-card-perfect?params=' + params
        // })

        let canBeSubmit = this.canBeSubmit()
        if (canBeSubmit) {
            this.creditcardVerify(res => {
                let supplementData = res.payload || {}
                this.setData({
                    supplementData
                })
                let params = encodeURIComponent(JSON.stringify(this.data))
                wx.navigateTo({
                    url: '/package-a/credit-card-perfect/credit-card-perfect?params=' + params
                })
            })

        }
    }
})