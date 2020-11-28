/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2020-04-19 13:16:32
 */


const app = getApp()
const util = require('../../utils/util.js')
let autoSwitchTime = 2000
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        // pattern: {
        //     type: String,
        //     value: 'card'
        // }
    },
    data: {
        current: 0,
        totalDevice: 0,
        editLabeSn: '',
        editLabeName: '',
        editMerchantName: '',
        showEditWindow: false,
        bannerIsShow: false,
        month: util.getMonth(true),
        deviceList: [],
        transactionNumber: 0,
        transactionAmount: 0,
        commissions: 0,
        totalAmount: 0, //今日已刷的额度
        totalLimitAmount: 0, //总额度
        usedAmount: 0,
        remainingAmount: 0,
        accountLength: 0,
        accountList: []
    },
    pageLifetimes: {
        show() {
            this.init()
        }
    },
    ready() {
        this.init()
    },

    methods: {
        init() {
            this.getMerchantList()
            this.getDeviceSummary()
            setTimeout(() => {
                this.setData({
                    current: 1
                })
            }, autoSwitchTime)
        },

        delMerchant(e) {
            let that = this
            let item = e.currentTarget.dataset.item
            let merchantId = item.merchantId
            let merchantName = item.merchantName
            let delMsg = '确定解除和商户:' + merchantName + '的绑定关系吗？'
            wx.showModal({
                content: delMsg,
                confirmColor: '#F23831',
                success: function (res) {
                    if (res.confirm) {
                        app.api.unbindMerchant({
                            params: {
                                merchantId: merchantId,
                            },
                            success(res) {
                                if (res.payload == 'success') {

                                    that.getMerchantList()
                                }
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })

        },
        swiperChange(e) {
            let current = e.detail.current
            this.setData({
                current
            })
        },
        getDeviceSummary: function () {
            let that = this
            app.api.getDeviceSummary({
                success(res) {
                    let data = res.payload[0] || []
                    if (data.length < 1) {
                        that.setData({
                            transactionNumber: 0,
                            transactionAmount: 0,
                            commissions: 0
                        })
                        return
                    }
                    let transactionAmount = ((data.expense * 100) - (data.income * 100)) / 100
                    //前端算法要改成 expenseTransactions -   incomeTransactions ;
                    let transactionNumber = data.expenseTransactions - data.incomeTransactions
                    let commissions = data.commissions
                    let month = util.timestampToTime(data.yearMonth, 4)
                    that.setData({
                        month,
                        transactionNumber,
                        transactionAmount: util.toNumbers(transactionAmount),
                        commissions: util.toNumbers(commissions)
                    })
                }
            })
        },
        editLabel(e) {
            let item = e.currentTarget.dataset.item
            this.setData({
                editLabeSn: item.sn,
                editLabeName: item.label,
                editMerchantName: item.merchantName,
                showEditWindow: true
            })
        },
        showSnRow(e) {
            let item = e.currentTarget.dataset.item
            let id = item.merchantId || ''
            let accountList = this.data.accountList || []
            accountList.forEach(m => {
                if (m.merchantId == id) {
                    m.showSn = !m.showSn
                }
            })
            this.setData({
                accountList
            })
        },
        cancelEidt() {
            this.setData({
                showEditWindow: false
            })
        },
        setlabelinputval(e) {
            this.setData({
                editLabeName: e.detail.value.trim()
            })
        },
        postSetLabel() {
            let that = this
            let label = this.data.editLabeName
            let sn = this.data.editLabeSn
            if (!label) {
                wx.showModal({
                    title: '错误',
                    content: '请输入名称',
                    showCancel: false,
                })

                return
            }

            app.api.setLabel({
                params: {
                    sn,
                    label
                },
                success(res) {
                    that.setData({
                        showEditWindow: false
                    })
                    that.getMerchantList()
                }
            })
        },
        getMerchantList() {
            app.api.getMerchantList({
                params: {
                    idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                    requestType:'POSLIST'
                },
                success: res => {
                    let data = res.payload || {}
                    let accountList = data.accountInfos || []
                    let accountLength = accountList.length
                    let usedAmount = Number(data.totalAmount)
                    let totalLimitAmount = Number(data.totalLimitAmount)
                    let remainingAmount = totalLimitAmount - usedAmount
                    this.setData({
                        usedAmount: util.toNumbers(usedAmount),
                        remainingAmount: util.toNumbers(remainingAmount),
                        accountList: this.formatAccountList(accountList),
                        accountLength
                    })
                }
            })
        },
        formatAccountList(accountList) {
            accountList.forEach(account => {
                account.showSn = false
                account.remainingAmountStr = util.toNumbers(Number(account.currentLimit) - Number(account.amount))
                account.merchantRegionName = app.getRegionName(account.merchantRegion, true)
                account.devices.forEach(device => {
                    device.hideSn = util.hideSnNumber(device.sn)
                })
            })
            return accountList
        },
        gotoAdPage() {
            wx.navigateTo({
                url: '/package-a/card-installments-ad/card-installments-ad'
            })
        },
        gotoTransactionStatistics() {
            wx.navigateTo({
                url: "/package-a/transaction-statistics/transaction-statistics"
            })
        },
        gotoReceiptAmount() {
            wx.navigateTo({
                url: "/package-a/receipt-amount/receipt-amount"
            })
        },
        gotoDeviceAccounting(e) {
            let item = e.currentTarget.dataset.item || {}
            let params = encodeURIComponent(JSON.stringify(item))
            wx.navigateTo({
                url: '/package-a/device-accounting/device-accounting?params=' + params
            })
        },


    }
})