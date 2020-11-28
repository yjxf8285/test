/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-29 17:04:25
 */
// 6221639592136621
const app = getApp()
import util from '../../utils/util.js'
import validate from '../../utils/validate.js'
let countrange = 59
let count = countrange
Page({
    data: {
        pageSource: '',
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
        let pageSource = opt.pageSource || '' //页面来源 提额:amount,其他空
        let merchantId = opt.merchantId || ''
        let name = opt.name || ''
        let idCard = opt.idCard || ''
        // let merchantId = '86101410548'
        console.info(opt)
        this.setData({
            pageSource,
            merchantId,
            name: name || app.globalData.name,
            idCard: idCard || app.globalData.idCard,
        })
    },
    setCardNo(e) {
        this.setData({
            cardNo: e.detail.value,
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
                //  DEBIT, CREDIT, PREPAID, SEMI_CREDIT 
                // 只有贷记卡、准贷记卡可以
                if (res.payload.cardType == 'CREDIT' || res.payload.cardType == 'SEMI_CREDIT') {
                    that.setData({
                        bankName: util.subBankName(res.payload.bankName),
                        cardName: res.payload.cardName,
                        cardNo,
                        isCreditCard: true
                    })
                    that.complete()
                }
                else {
                    that.setData({
                        bankName: '',
                        cardName: '',
                        isCreditCard: false
                    })
                    setTimeout(m => {
                        util.showToast('仅支持贷记卡和准贷记卡')
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
    complete() {
        let that = this
        this.creditcardVerify(() => {
            util.showToast('提额成功!')
            setTimeout(function () {
                that.goBack()
            }, 2000)
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
                merchantId: that.data.merchantId,
                source: 'KAISHUA',
                tag: 0,
                idCard: that.data.idCard,
                mobile: that.data.mobile,
                name: that.data.name,
                code: that.data.code
            }, success(res) {
                setTimeout(function () {
                    cb && cb(res)
                }, 1000)
            }
        }
            //  ,res => {
            //     // util.showToast('请输入姓名!')
            // }
        )
    },
    checkInputRule() {
        let that = this
        let cardNo = that.data.cardNo,
            mobile = that.data.mobile,
            code = that.data.code;

        console.info(cardNo)

        if (cardNo == '') {
            util.showToast('请输入信用卡号!')
            return false
        }
        if (!this.data.cardNo) {
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
    goBack() {
        // 如果是提额列表过来的就返回上一页，否则就回首页
        if (this.data.pageSource == 'amount') {
            wx.navigateBack()
        } else {
            wx.reLaunch({
                url: "/pages/index/index"
            })
        }

    },
    skip() {
        let that = this
        wx.showModal({
            title: '提示',
            content: '跳过信用卡认证，交易额度较低!',
            success: function (res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    })
                }
            }
        })
    },
    submit() {
        if (!this.checkInputRule()) return
        this.getBankName() // 先去拿银行名称，然后再提交

    }
})