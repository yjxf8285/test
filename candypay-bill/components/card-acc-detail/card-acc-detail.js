/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-06-14 17:36:13
 */
const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        cardNo: {
            type: Number,
            value: 0
        },
        cardData: {
            type: Object,
            value: null
        }
    },
    data: {
        modalShow: false,
        lastTransactionData: null,
        monthSummary: {
            totalAvailable: '0.00',
            transactions: '0.00',
            limitAmount: '0.00',
            commissions: '0.00',
            expense: '0.00',
            debtAmount: '0.00',
        },
        categoryList: []
    },
    pageLifetimes: {
        show() {
            this.init()
        }
    },
    ready() {
        console.info(this.data.cardData)
        this.init()
    },
    methods: {
        init() {
            this.getStatement()
            this.getTransactionLast()
        },
        showModal() {
            app.setBtnvisual(false) // 隐藏滑动按钮
            this.setData({
                modalShow: true
            })
        },
        hideModal() {
            app.setBtnvisual(true) // 显示滑动按钮
            this.setData({
                modalShow: false
            })
        },
        // 上一笔记账
        getTransactionLast() {
            let cardNo = this.data.cardNo || ''
            app.api.getTransactionLast({
                params: {
                    cardNo
                },
                success: res => {
                    let data = res.payload
                    let lastTransactionData = null
                    if (!util.isEmpty(data)) {
                        lastTransactionData = {
                            transComments: data.transComments,
                            amount: util.toNumbers(data.amount),
                            occurTime: util.timestampToTime(data.occurTime, 2),
                            cardNo: util.hideCardNumber(data.cardNo),
                            bankName: data.bankName,
                            vendorName: data.vendorName
                        }
                    }
                    this.setData({
                        lastTransactionData
                    })
                }
            })
        },
        // 单卡统计
        getStatement() {
            let that = this
            let cardNo = that.data.cardNo
            if (!cardNo) return
            app.api.getStatement({
                data: {
                    cardNo,
                    yearMonth: util.getMonth(0)
                },
                success: res => {
                    let data = res.payload
                    if (util.isEmpty(data)) return
                    let summary = data.summary || {}
                    let categoryList = data.mcc || [] // data of mcc was better fully 
                    categoryList.forEach(m => {
                        let newExpense = Number(m.expense) - Number(m.income) // 花费-收入
                        m.percent = Number(newExpense * 100 / summary.expense).toFixed(2)
                        if (isNaN(m.percent)) {
                            m.percent = '0.00'
                        }
                        m.expenseTxt = util.toNumbers(newExpense / 1000)
                    });
                    // 笔数：incomeTransactions+expenseTransactions
                    // 总授信额度： limitAmount
                    // 费用合计：commissions
                    // 总消费：expense
                    // 总可用额度：availableLimit
                    // 总负债：debtAmount
                    // 总负债比 debtAmount/limitAmount
                    // 当前透支：debtAmount
                    let overdraft = summary.expense + summary.debtAmount
                    //todo v2.1的时候记得把360环形图这里的逻辑抽出来放一个公共函数
                    let barColor = '4CB90C'
                    let percent = Number(summary.debtAmount * 100 / summary.limitAmount).toFixed(2) //负债比
                    let progress = percent * 3.6 //提前转换好，因为目前基础库版本不支持组件的watch功能，所以很多计算不建议在组件内部实现。
                    percent = Number(percent)
                    // <60% 绿色、60%<=负债比<=80% 橙色、>80% 红色
                    if (percent < 60) {
                        barColor = '#4CB90C'
                    }
                    if (80 >= percent && percent >= 60.0) {
                        barColor = '#F39B27'
                    }
                    if (percent > 80) {
                        barColor = '#EB464E'
                    }
                    if (progress >= 360) progress = 360 // 最大360
                    let totalAvailable = util.toNumbers(summary.limitAmount - summary.debtAmount)
                    if (totalAvailable < 0) totalAvailable = 0
                    if (summary.debtAmount < 0) { summary.debtAmount = 0 }
                    if (percent < 0) {
                        percent = 0
                        progress = 0
                    }
                    this.setData({
                        categoryList,
                        monthSummary: {
                            ym: util.getNowDate(5),
                            progress,
                            percent: percent.toFixed(2),
                            barColor,
                            transactions: summary.incomeTransactions + summary.expenseTransactions,
                            limitAmount: util.toNumbers(summary.limitAmount),
                            commissions: util.toNumbers(summary.commissions),
                            expense: util.toNumbers(summary.expense),
                            debtAmount: util.toNumbers(summary.debtAmount),
                            totalAvailable,// 废弃了
                            availableLimit: summary.availableLimit
                        }
                    })
                }
            })
        },
        showDataInstruction() {
            wx.navigateTo({
                url: '/package-a/data-instruction/data-instruction'
            })
        },
        gotoRepay() {
            let item = this.data.cardData || {}
            let params = encodeURIComponent(JSON.stringify(item))
            wx.navigateTo({
                url: '/package-a/card-acc-torepay/card-acc-torepay?params=' + params
            })
        },
        gotoManualAccouting() {
            let item = this.data.cardData || {}
            let params = encodeURIComponent(JSON.stringify(item))
            wx.navigateTo({
                url: '/package-a/manual-accounting/manual-accounting?params=' + params
            })
        }
    }
})