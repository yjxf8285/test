/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2018-09-10 14:08:59
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-09 11:47:19
 */


// 身份证
// 451030196206301440
// 410327196612153893
// 371523199309279351
// 610425199302251184
// 421281199508280867

// 18623451234

// 信用卡
// 6250298104549518
// 6250290766639489
// 6250297809430347
// 6250296891727636
// 6250291563991925
import util from '../../utils/util'
import validate from '../../utils/validate.js'

const repayFixDate = ['每月1号', '每月2号', '每月3号', '每月4号', '每月5号', '每月6号', '每月7号', '每月8号', '每月9号', '每月10号', '每月11号', '每月12号', '每月13号', '每月14号', '每月15号', '每月16号', '每月17号', '每月18号', '每月19号', '每月20号', '每月21号', '每月22号', '每月23号', '每月24号', '每月25号', '每月26号', '每月27号', '每月28号']
const repayFixDays = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天']
const app = getApp()
Page({
    data: {
        date: repayFixDate,
        repayDate: [
            ['固定日期', '固定间隔'],
            repayFixDate
        ],
        cardNo: '',//卡号
        bankName: '',//银行名称
        cardName: '',//卡名称
        billDay: '',//账单日
        repayDisplayDay: '',//还款日
        cardCredit: '',//卡片额度
        arrears: '',//欠款额度,
        isCreditCard: false,
        vendorEnabled: true,
        cardList: [],
        entryMode: '',
        hiddenSave: false,
        disableEditCard: false,
        addCardStep: 0,
        cardOwnerName: '',
        cardOwnerIdCard: '',
        cardOwnerMobile: '',
        cardOwnerVcode: '',
        vcodeBtnDisable: false,
        getVerifyCodeTxt: '获取验证码',
        cardShared: false,
        billShared: false,
        repayIndex: [0, 0],
        dueDate: 0,
        dueInteval: 0,
        isGuestUser: true,
        cardDisplayNo: ''
    },
    onLoad(opt) {
        let that = this
        this.setData({
            isGuestUser: app.globalData.isGuestUser
        })
        if (opt.entryMode == 'addCard') {
            if (opt.cardList != undefined) {
                this.setData({
                    cardList: JSON.parse(opt.cardList),
                    entryMode: 'addCard',
                    addCardStep: 1
                })
            }
        }
        else if (opt.entryMode == 'editCard') {
            if (opt.card != undefined) {
                let myCard = JSON.parse(opt.card);
                wx.setNavigationBarTitle(
                    {
                        title: '卡片编辑',
                        success: function (res) {
                            app.api.getCard({
                                data: {
                                    cardNo: myCard.cardNo
                                },
                                success(res) {
                                    if (res.payload.length > 0) {
                                        let card = res.payload[0]
                                        that.setData({
                                            cardNo: card.cardNo,
                                            cardDisplayNo: util.subCardNumber(card.cardNo),
                                            bankName: util.subBankName(card.bankName),
                                            cardName: card.name,
                                            cardCredit: card.creditLimit,
                                            billDay: card.closingDate,
                                            arrears: Number(card.arrears > 0 ? card.arrears : 0).toFixed(2),
                                            vendorEnabled: card.vendorEnabled,
                                            billShared: card.shareBillEnabled,
                                            cardShared: card.shareAmountEnabled,
                                            isCreditCard: card.type == 'CREDIT',
                                            entryMode: 'editCard',
                                            hiddenSave: true,
                                            disableEditCard: true,
                                            dueDate: card.dueDate,
                                            dueInteval: card.dueInteval
                                        })
                                        if (card.dueInteval != null && card.dueInteval > 0) {
                                            that.realChangeColumn(0, 1)
                                            let repayDisplayDay = that.data.repayDate[0][1] + ' ' + that.data.repayDate[1][card.dueInteval - 1]
                                            that.setData({
                                                repayDisplayDay: repayDisplayDay
                                            })
                                        }
                                        else if (card.dueDate != null && card.dueDate > 0) {
                                            that.realChangeColumn(0, 0)
                                            let repayDisplayDay = that.data.repayDate[0][0] + ' ' + that.data.repayDate[1][card.dueDate - 1]
                                            that.setData({
                                                repayDisplayDay: repayDisplayDay
                                            })
                                        }

                                    }

                                }
                            })

                        }
                    }
                )
            }
        }
    },
    onVendorSwitch(e) {
        this.setData({
            vendorEnabled: e.detail.value,
            hiddenSave: false
        })
    },
    onInputBlur(e) {
        console.log(e.detail.value)
        if (e.target.id == "cardno-input") {
            //获取到输入值
            let cardNo = e.detail.value
            if (cardNo != this.data.cardNo) {
                this.setData({
                    cardNo: cardNo,
                    cardDisplayNo: util.subCardNumber(cardNo)
                })
            }
            else {
                return
            }

            if (this.data.cardList.length != 0) {
                for (let i = 0; i < this.data.cardList.length; i++) {
                    if (this.data.cardList[i].cardNo == cardNo) {
                        util.showToast('您已绑定该卡，无需重复绑定!')
                        this.setData({
                            bankName: '',
                            cardName: '',
                            isCreditCard: false,
                        })
                        return
                    }
                }
            }
            //拿到卡号之后本地进行一次luna验证
            if (validate.luhnCheck(cardNo)) {
                console.log('校验通过')
                this.getCardBin(cardNo)
            }
            else {
                console.log('校验失败')
                util.showToast('请输入正确的卡号!')
                this.setData({
                    bankName: '',
                    cardName: '',
                    isCreditCard: false,
                })
            }
        }
    }, 
    
    getCardBin(cardNo) {
        let that = this
        app.api.getCardBin({
            data: {
                cardNo: cardNo,
                type:'MP'
            },
            success(res) {
                if (res.payload.cardType == 'CREDIT') {
                    that.setData({
                        bankName: util.subBankName(res.payload.bankName),
                        cardName: res.payload.cardName,
                        isCreditCard: true,
                    })
                }
                else {
                    that.setData({
                        bankName: '',
                        cardName: '',
                        isCreditCard: false,
                    })
                    util.showToast('该卡片不是信用卡，请使用信用卡!')
                }
            }
        }
        )
    }, 
    onBillDayPicker(e) {
        console.log(JSON.stringify(e.detail))
        let billDay = Number(e.detail.value) + 1
        this.setData({
            hiddenSave: false,
            billDay: billDay
        })
    }, 
    onRepayDayPicker(e) {
        console.log(JSON.stringify(e))
        let repayDisplayDay = this.data.repayDate[0][e.detail.value[0]] + ' ' + this.data.repayDate[1][e.detail.value[1]]
        if (e.detail.value[0] == 0) {
            this.setData({
                dueDate: e.detail.value[1] + 1,
                dueInteval: 0
            })
        } else if (e.detail.value[0] == 1) {
            this.setData({
                dueInteval: e.detail.value[1] + 1,
                dueDate: 0
            })
        }
        this.setData({
            hiddenSave: false,
            repayDisplayDay: repayDisplayDay
        })
    },
     onSaveBtn() {
        let that = this
        if(this.data.entryMode!='editCard'&&this.data.cardOwnerName.length <2 ){
            util.showToast('姓名至少输入2个字!')
            return 
        }
        if (this.data.cardList.length != 0) {
            for (let i = 0; i < this.data.cardList.length; i++) {
                if (this.data.cardList[i].cardNo == this.data.cardNo) {
                    util.showToast('您已绑定该卡，无需重复绑定!')
                    return
                }
            }
        }
        if (!this.data.isCreditCard) {
            util.showToast('请填写正确的信用卡号!')
            return
        }
        if (this.data.cardNo == '' || this.data.bankName == '') {
            util.showToast('卡片信息填写不完整!')
            return
        }
        if (this.data.entryMode == 'addCard') {

            switch (this.data.addCardStep) {
                case 1:
                    if (!that.checkVcodeParam()) {
                        return
                    }
                    app.api.cardVerify({
                        data: {
                            cardNo: that.data.cardNo,
                            idCard: that.data.cardOwnerIdCard,
                            mobile: that.data.cardOwnerMobile,
                            name: that.data.cardOwnerName,
                            code: that.data.cardOwnerVcode
                        }, success(res) {
                            console.log('验证通过,进入下一个页面')
                            let card = res.payload
                            that.setData({
                                addCardStep: 2,
                                cardCredit: card.shareAmountEnabled ? card.creditLimit : '',
                                billDay: card.shareBillEnabled ? card.closingDate : '',
                                arrears: card.shareBillEnabled ? Number(card.arrears > 0 ? card.arrears : 0).toFixed(2) : '',
                                billShared: card.shareBillEnabled,
                                cardShared: card.shareAmountEnabled,
                                dueDate: card.dueDate,
                                dueInteval: card.dueInteval
                            })

                            if (card.shareBillEnabled) {
                                if (card.dueDate != null && card.dueDate > 0) {
                                    that.realChangeColumn(0, 0)
                                    let repayDisplayDay = that.data.repayDate[0][0] + ' ' + that.data.repayDate[1][card.dueDate - 1]
                                    that.setData({
                                        repayDisplayDay: repayDisplayDay
                                    })
                                }
                                else if (card.dueInteval != null && card.dueInteval > 0) {
                                    that.realChangeColumn(0, 1)
                                    let repayDisplayDay = that.data.repayDate[0][1] + ' ' + that.data.repayDate[1][card.dueInteval - 1]
                                    that.setData({
                                        repayDisplayDay: repayDisplayDay
                                    })
                                }
                            }

                        }
                    })

                    break;
                case 2:
                    if (!that.checkCardParam()) {
                        return
                    }
                    if (that.data.dueInteval > 0) {
                        app.api.bindCard({
                            data: {
                                cardNo: that.data.cardNo,
                                shareAmountEnabled: that.data.cardShared,
                                shareBillEnabled: that.data.billShared,
                                creditLimit: that.data.cardCredit,
                                arrears: that.data.arrears,
                                closingDate: that.data.billDay,
                                dueInteval: that.data.dueInteval,
                                vendorEnabled: that.data.vendorEnabled,
                            }, success() {
                                console.log('验证通过,绑定成功，跳动画')
                                that.setData({
                                    addCardStep: 3
                                })
                                util.showToast('添加卡片成功!')
                                setTimeout(function () {
                                    wx.navigateBack()
                                }, 1000)
                            }
                        })
                    }
                    else if (that.data.dueDate > 0) {
                        app.api.bindCard({
                            data: {
                                cardNo: that.data.cardNo,
                                shareAmountEnabled: that.data.cardShared,
                                shareBillEnabled: that.data.billShared,
                                creditLimit: that.data.cardCredit,
                                arrears: that.data.arrears,
                                closingDate: that.data.billDay,
                                dueDate: that.data.dueDate,
                                vendorEnabled: that.data.vendorEnabled,
                            }, success() {
                                console.log('验证通过,绑定成功，跳动画')
                                that.setData({
                                    addCardStep: 3
                                })
                                util.showToast('添加卡片成功!')
                                setTimeout(function () {
                                    wx.navigateBack()
                                }, 1000)
                            }
                        })
                    }

                    break;
                case 3:
                    break;
            }
        }
        else {
            if (!that.checkCardParam()) {
                return
            }
            let time = new Date().getTime()
            if ((time - app.globalData.updateCardTime) < (10 * 1000)) {
                util.showToast('操作过快，请您稍后再试。')
                return
            }
            else {
                app.globalData.updateCardTime = time
            }
            if (that.data.dueInteval > 0) {
                app.api.updateCard({
                    data: {
                        cardNo: that.data.cardNo,
                        shareAmountEnabled: that.data.cardShared,
                        shareBillEnabled: that.data.billShared,
                        creditLimit: that.data.cardCredit,
                        arrears: that.data.arrears,
                        closingDate: that.data.billDay,
                        dueInteval: that.data.dueInteval,
                        vendorEnabled: that.data.vendorEnabled,
                    }
                    , success(res) {
                        if (res.error == null) {
                            util.showToast('更新卡片成功!')
                            wx.navigateBack()
                        }
                    }
                })
            }
            else if (that.data.dueDate > 0) {
                app.api.updateCard({
                    data: {
                        cardNo: that.data.cardNo,
                        shareAmountEnabled: that.data.cardShared,
                        shareBillEnabled: that.data.billShared,
                        creditLimit: that.data.cardCredit,
                        arrears: that.data.arrears,
                        closingDate: that.data.billDay,
                        dueDate: that.data.dueDate,
                        vendorEnabled: that.data.vendorEnabled,
                    }
                    , success(res) {
                        if (res.error == null) {
                            util.showToast('更新卡片成功!')
                            wx.navigateBack()
                        }
                    }
                })
            }

        }
    }, 
    onCardCreditBlur(e) {
        console.log(e)
        let v1 = e.detail.value
        if (v1 == '') {
            v1 = '0'
        }
        let v2 = parseFloat(v1).toFixed(2)
        if (v2 == NaN || v2 == 'NaN') {
            return;
        }
        this.setData({
            hiddenSave: false,
            cardCredit: v1
        })
    }, 
    onAvailableCreditBlur(e) {
        console.log(e)
        let v1 = e.detail.value
        if (v1 == '') {
            v1 = '0'
        }
        let v2 = parseFloat(v1).toFixed(2)
        if (v2 == NaN || v2 == 'NaN') {
            return;
        }
        this.setData({
            hiddenSave: false,
            arrears: v2
        })
    }
    , onSendVcode() {
        if (this.data.vcodeBtnDisable) {
            return;
        }
        let that = this
        if (!validate.isPhoneAvailable(that.data.cardOwnerMobile)) {
            util.showToast('请输入正确的手机号码')
            return;
        }
        app.api.getCardVerificationCode({
            data: {
                mobile: that.data.cardOwnerMobile
            },
            success() {
                console.log('发送成功')
                that.sendSmsSuccess()
            }
        })
    },
    setCardOwnerName(e) {
      
        if (e.detail.value&&!validate.checkChineseName(e.detail.value)) {
            return this.data.cardOwnerName
        }
        this.setData({
            cardOwnerName: e.detail.value,
        })

    },
    setCardOwnerId(e) {
        this.setData({
            cardOwnerIdCard: e.detail.value,
        })
    },
    setCardOwnerMobile(e) {
        this.setData({
            cardOwnerMobile: e.detail.value,
        })
    },
    setCardOwnerVcode(e) {
        this.setData({
            cardOwnerVcode: e.detail.value,
        })
    },
    sendSmsSuccess() {
        console.log('开始倒计时')
        this.countDown(this, 60);

    },
    countDown(that, count) {

        if (count == 0) {
            that.setData({
                getVerifyCodeTxt: '获取验证码',
                vcodeBtnDisable: false
            })
            return;
        }

        that.setData({
            vcodeBtnDisable: true,
            getVerifyCodeTxt: '重新获取(' + count + 's...)',
        })

        setTimeout(function () {
            count--;
            that.countDown(that, count);
        }, 1000);
    },
    onCardShardChange(e) {
        let that = this
        this.setData({
            cardShared: e.detail.value,
            billShared: e.detail.value ? that.data.billShared : false,
            hiddenSave: false
        })
    },
    onBillShardChange(e) {
        let that = this
        this.setData({
            billShared: e.detail.value,
            hiddenSave: false
        })
    },
    onCardCreditInput(e) {
        if (e.detail.value == '') {
            // this.setData({
            //   cardCredit: 0
            // })
        }
    },
    onArrearsInput(e) {
        if (e.detail.value == '') {
            // this.setData({
            //   arrears: 0.00
            // })
        }
    },
    onRepayColumnChange(e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        this.realChangeColumn(e.detail.column, e.detail.value)

    },
    realChangeColumn(column, value) {
        switch (column) {
            case 0:
                if (value == 0) {
                    this.setData({
                        repayDate: [['固定日期', '固定间隔'], repayFixDate],
                        repayIndex: [0, 0]
                    })
                }
                else if (value == 1) {
                    this.setData({
                        repayDate: [['固定日期', '固定间隔'], repayFixDays],
                        repayIndex: [1, 0]
                    })
                }
                break;
        }
    },
    checkVcodeParam() {
        if (this.data.cardOwnerName == '') {
            util.showToast('持卡人姓名不能为空!')
            return false
        }
        if (!validate.checkChineseName(this.data.cardOwnerName)) {
            util.showToast('输入持卡人姓名有误!')
            return false
        }
        if (this.data.cardOwnerIdCard == '') {
            util.showToast('请填写持卡人身份证号码!')
            return false
        }

        if (this.data.cardOwnerIdCard.length != 18) {
            util.showToast('身份证号码必须为18位!')
            return false
        }

        if (this.data.cardOwnerMobile == '') {
            util.showToast('请填写预留手机号码!')
            return false
        }
        if (!validate.isPhoneAvailable(this.data.cardOwnerMobile)) {
            util.showToast('请输入正确的手机号码')
            return;
        }
        if (this.data.cardOwnerVcode == '') {
            util.showToast('请填写验证码!')
            return false
        }
        if (this.data.cardOwnerVcode.length != 6) {
            util.showToast('验证码长度不正确!')
            return false
        }
        return true
    },
    checkCardParam() {
        if (this.data.cardCredit == '') {
            this.setData({
                cardCredit: 0
            })
        }
        if (this.data.arrears == '') {
            this.setData({
                arrears: Number(0).toFixed(2)
            })
            return false
        }

        if (!(this.data.dueDate > 0) && !(this.data.dueInteval > 0)) {
            util.showToast('请填写还款日!')
            return false
        }
        if (this.data.billDay == '') {
            util.showToast('请填写账单日!')
            return false
        }
        if (this.data.cardCredit < 2000) {
            util.showToast('卡片额度必须大于2000元!')
            return false
        }
        if (Number(this.data.cardCredit) < Number(this.data.arrears)) {
            util.showToast('卡片额度不可小于欠款额度!')
            return false
        }
        return true
    }
})