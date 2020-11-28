/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2019-09-24 17:06:45
 */

const app = getApp()
const util = require('../../utils/util.js')
const repayFixDate = ['每月1号', '每月2号', '每月3号', '每月4号', '每月5号', '每月6号', '每月7号', '每月8号', '每月9号', '每月10号', '每月11号', '每月12号', '每月13号', '每月14号', '每月15号', '每月16号', '每月17号', '每月18号', '每月19号', '每月20号', '每月21号', '每月22号', '每月23号', '每月24号', '每月25号', '每月26号', '每月27号', '每月28号']
const repayFixDays = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天']
Page({
    data: {
        date: repayFixDate,
        repayDate: [
            ['固定日期', '固定间隔'],
            repayFixDate
        ],
        repayIndex: [0, 0],
        cardNo: '',
        bankName: '',
        cardName: '',
        vendorEnabled: true,
        cardShared: true, // 共额
        billShared: true, // 共账
        cardCredit: '', //授信额度
        arrears: '',// 未还欠款
        billDay: '', // 账单日
        dueDate: '',//还款日
        dueInteval: '',//还款间隔
        repayDisplayDay: '',//判断还款日格式显示的字符串

    },
    onLoad: function (opt = {}) {
        let p = decodeURIComponent(opt.params || '{}')
        let params = JSON.parse(p)
        let supplementData = params.supplementData || {}
        let dueDate = supplementData.dueDate || ''
        let dueInteval = supplementData.dueInteval || ''//还款间隔
        let repayDisplayDay = ''
        if (dueDate) {
            repayDisplayDay = '固定日期 ' + repayFixDate[dueDate - 1]
        } else {
            repayDisplayDay = '固定间隔 ' + repayFixDays[dueInteval - 1]
        }
        this.setData({
            beautiCardNo: util.subCardNumber(params.cardNo || ''),
            cardNo: params.cardNo || '',
            bankName: params.bankName || '',
            cardName: params.cardName || '',
            cardShared: supplementData.shareAmountEnabled, // 共额
            billShared: supplementData.shareBillEnabled, // 共账
            cardCredit: supplementData.creditLimit || '', //授信额度
            arrears: supplementData.arrears || '',// 未还欠款
            billDay: supplementData.closingDate || '', // 账单日
            dueDate: dueDate || '',//还款日
            dueInteval: dueInteval || '',//还款间隔
            repayDisplayDay
        })
    },
    onCardShardChange(e) {
        let that = this
        this.setData({
            cardShared: e.detail.value,
            billShared: e.detail.value ? that.data.billShared : false,
        })
    },
    onBillShardChange(e) {
        let that = this
        this.setData({
            billShared: e.detail.value,
        })
    },
    onCardCreditBlur(e) {
        let cardCredit = e.detail.value || 0
        // cardCredit = parseFloat(cardCredit).toFixed(2)
        this.setData({
            cardCredit
        })
    },
    onAvailableCreditBlur(e) {
        let arrears = e.detail.value || 0
        arrears = parseFloat(arrears).toFixed(2)
        this.setData({
            arrears
        })
    },
    onBillDayPicker(e) {
        let billDay = Number(e.detail.value) + 1
        this.setData({
            billDay
        })
    },
    bindMultiPickerColumnChange(e) {
        let column = e.detail.column
        let value = e.detail.value || ''
        switch (column) {
            case 0:
                if (value == 0) {
                    this.setData({
                        repayDate: [['固定日期', '固定间隔'], repayFixDate],
                        repayIndex: [0, 0]
                    })
                }
                if (value == 1) {
                    this.setData({
                        repayDate: [['固定日期', '固定间隔'], repayFixDays],
                        repayIndex: [1, 0]
                    })
                }
                break;
        }
    },
    onRepayDayPicker(e) {
        let value = e.detail.value || []
        let repayDate = this.data.repayDate || []
        let repayDisplayDay = repayDate[0][value[0]] + ' ' + repayDate[1][value[1]]
        if (value[0] == 0) {
            this.setData({
                dueDate: value[1] + 1,
                dueInteval: 0
            })
        } else if (value[0] == 1) {
            this.setData({
                dueInteval: value[1] + 1,
                dueDate: 0
            })
        }
        this.setData({
            repayDisplayDay
        })
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
        if (this.data.cardCredit < 2000) {
            util.showToast('卡片额度必须大于2000元!')
            return false
        }
        if (Number(this.data.cardCredit) < Number(this.data.arrears)) {
            util.showToast('卡片额度不可小于欠款额度!')
            return false
        }

        if (this.data.billDay == '') {
            util.showToast('请填写账单日!')
            return false
        }
        if (!(this.data.dueDate > 0) && !(this.data.dueInteval > 0)) {
            util.showToast('请填写还款日!')
            return false
        }
        return true
    },
    gotoReceiptAmount() {
        wx.navigateBack({
            delta: 2
        })
    },
    complete() {
        let that = this
        let checkCardParam = this.checkCardParam()
        if (!checkCardParam) return
        let data = {
            cardNo: that.data.cardNo,
            shareAmountEnabled: that.data.cardShared,
            shareBillEnabled: that.data.billShared,
            creditLimit: that.data.cardCredit,
            arrears: that.data.arrears,
            closingDate: that.data.billDay,
            dueDate: that.data.dueDate || null,
            dueInteval: that.data.dueInteval || null,
            vendorEnabled: that.data.vendorEnabled,
        }
        app.api.bindCard({
            data,
            success() {
                util.showToast('完成!')
                setTimeout(function () {
                    that.gotoReceiptAmount()
                }, 1000)
            }
        })
    }

})