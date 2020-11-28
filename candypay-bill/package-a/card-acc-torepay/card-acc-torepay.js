/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-16 12:04:53
 * @LastEditTime: 2020-04-15 16:44:36
 */

const app = getApp()
import util from '../../utils/util'
Page({
    data: {
        cardNo: '',
        cardData: {},
        canSave: false,
        merchantName: '',
        mccGroup: '',
        region: '',
        occurTime: '',
        amount: '',
        transComments: '',
        type: '',
        typeStr: '请选择',
        amountNumber: '0.00',
        regionName: '',
        startDate: '',
        endData: ''
    },
    onShow() {
        this.getCardListSearch()
    },
    onLoad(opt) {
        let p = decodeURIComponent(opt.params || '')
        let params = JSON.parse(p || '{}')
        this.setData({
            cardNo: params.cardNo || ''
        })
    },
    onReady() {
        let curDate = util.getNowDate()
        this.setData({
            endData: curDate
        })
    },
    // 获取卡片详情
    getCardListSearch() {
        app.api.getCardListSearch({
            params: {
                cardNo: this.data.cardNo
            },
            success: res => {
                let cardData = res.payload || []
                this.setData({
                    cardData: this.formatList(cardData[0])
                })
            }
        })
    },
    formatList(item = {}) {

        if (app.globalData.accountList.length > 0) {
            item.merchantRegion = Number(app.globalData.accountList[0].merchantRegion)
        }
        item.bankImg = util.getBankLogo(item.groupId)
        item.vendorName = item.vendorName || item.merchantName || ''
        item.merchantRegionCode = item.merchantRegion || ''
        item.vendorRegionName = app.getRegionName(item.vendorRegion, true) // 设备地区
        item.vendorMccCategoryName = app.getMccCategoryName(item.vendorMcc) // 设备大类
        item.vendorMccGroupName = app.getMccGroupName(item.vendorMcc) // 设备组名
        item.currClosingDateStr = util.timestampToTime(item.currClosingDate, 3).replace('-',
            '月')
        item.currRepaymentDateStr = util.timestampToTime(item.currRepaymentDate, 3).replace('-',
            '月')
        item.curmonth = util.getNowDate(4)
        item.availableLimitStr = util.toNumbers(item.availableLimit)
        item.occurTime = util.timestampToTime(item.occurTime)
        item.hidecardNo = util.hideCardNumber(item.cardNo)
        return item
    },
    onTabClick() {
        this.triggerEvent('onTabClick', 1)
    },
    onRegionSelect({ detail }) {
        this.setData({
            region: detail.cityId
        })
        this.checkCanSave()
    },
    onTypeSelect({ detail }) {
        let val = Number(detail.value)
        let typeStr = ''
        let type = ''
        switch (val) {
            case 0:
                typeStr = '消费'
                type = 'REGULAR'
                break
            case 1:
                typeStr = '退货'
                type = 'REFUND'
                break

        }

        this.setData({
            type,
            typeStr
        })
        this.checkCanSave()
    },
    bindDateChange: function (e) {
        this.setData({
            occurTime: e.detail.value
        })
        this.checkCanSave()
    },

    onSelcetMcc({ detail }) {
        let mccObj = app.getMccId(detail)
        this.setData({
            mccGroup: detail,
            mccId: mccObj.id
        })
        this.checkCanSave()
    },
    bindiMerchantNameInput(e) {
        let val = e.detail.value
        this.setData({
            transComments: val
        })
    },
    // 检查当前表单是否可以保存
    checkCanSave() {
        let region = this.data.region
        let occurTime = this.data.occurTime
        let amount = this.data.amount

        if (this.data.amount) {
            let errText = '还款金额，不允许超过卡片负债'
            if (Number(this.data.amount) > Number(this.data.cardData.debt)) {
                util.showToast(errText)
                this.setData({
                    canSave: false
                })
                return
            }
        }

        if (
            region &&
            occurTime &&
            amount) {
            this.setData({
                canSave: true
            })
        } else {
            this.setData({
                canSave: false
            })
        }
    },
    bindAmountInput() {
        this.selectComponent("#keypad").show()
    },
    hideKeyPad() {
        this.selectComponent("#keypad").hide()
    },
    keypadSubmit({ detail }) {
        if (!detail) {
            util.showToast('请输入有效金额')
        }
        this.setData({
            amount: detail,
            amountNumber: util.toNumbers(detail)
        })
        this.checkCanSave()
    },
    save() {
        let cardNo = this.data.cardData.cardNo
        let region = this.data.region
        let occurTime = this.data.occurTime
        let amount = this.data.amount
        let transComments = this.data.transComments

        if (!this.data.canSave) return
        app.api.createTransaction({
            data: {
                cardNo,
                region,
                occurTime,
                transComments,
                amount,
                type: 'REPAYMENT', // 交易类型 REGULAR, VOID 消费 退货 REPAYMENT还款
            },
            success(res) {
                // 显示确认框
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 1000
                })
                // 切换前先标识一下是从手账过来的，成功后记得重置一下变量为false
                app.globalData.fromCardAccM = true
                wx.navigateTo({
                    url: "/package-a/data-statistics/data-statistics"
                })
            }
        })
    }
})