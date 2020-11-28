/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2020-03-26 17:00:00
 */


const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    data: {

        bannerIsShow: false,
        patternName: '卡片模式',
        cardList: [],
        merberNum: 0,
        cardNum: 0,
        monthSummary: {
            ym: '',
            transactions: 0,
            limitAmount: 0,
            commissions: 0,
            expense: 0,
            debtAmount: 0,
        },
        lastTransactionData: null,
        paymentList: []
    },
    pageLifetimes: {
        show() {
            this.getData()
        }
    },
    ready() {
        this.circleProgressPie = this.selectComponent('#circle-progress-pie')
        this.getData()
    },
    methods: {
        getData() {
            this.getAdBannerStatus()
            this.getMemberList()
            this.getCardListData()
            this.getTransactionLast()
            this.getRepaymentdocket()
            this.getCurrentMonthIncomeExpense()
        },
        getAdBannerStatus() {
           
            app.api.bannerIsShow({
                success: res => {
                    this.setData({
                        bannerIsShow: res.payload
                    })
                }
            })
        },
        // 当月汇总
        getCurrentMonthIncomeExpense() {
            app.api.getCurrentMonthIncomeExpense({
                success: res => {

                    let data = res.payload
                    if (util.isEmpty(data)) return
                    // this.circleProgressPie.setChartOption([data.debtAmount, data.limitAmount]) // 传入饼图数据

                    // 笔数：incomeTransactions+expenseTransactions
                    // 总授信额度： limitAmount
                    // 费用合计：commissions
                    // 总消费：expense
                    // 总可用额度：limitAmount-debtAmount
                    // 总负债：debtAmount
                    // 总负债比 debtAmount/limitAmount
                    let percent = Number(data.debtAmount * 100 / data.limitAmount).toFixed(2) //负债比
                    let progress = percent * 3.6 //提前转换好，因为目前基础库版本不支持组件的watch功能，所以很多计算不建议在组件内部实现。
                    if (progress >= 360) progress = 360 // 最大360
                    this.setData({
                        monthSummary: {
                            ym: util.getNowDate(5),
                            progress,
                            percent,
                            transactions: data.incomeTransactions + data.expenseTransactions,
                            limitAmount: util.toNumbers(data.limitAmount),
                            commissions: util.toNumbers(data.commissions),
                            expense: util.toNumbers(data.expense),
                            debtAmount: util.toNumbers(data.debtAmount),
                            totalAvailable: util.toNumbers(data.limitAmount - data.debtAmount)
                        }
                    })
                }
            })
        },
        // 用款日历列表
        getRepaymentdocket() {
            app.api.getRepaymentdocket({
                success: res => {
                    let data = res.payload || []
                    let availableList = []
                    data.forEach(m => {
                        m.remain = m.remain == 0 ? '今天' : m.remain + '天后'
                        m.repaymentDate = util.timestampToTime(m.repaymentDate, 3).replace('-', '月').trim() + '日'
                        if (m.repaymentAmount < 0) m.repaymentAmount = 0
                        m.repaymentAmount = util.toNumbers(m.repaymentAmount)
                        if (m.cardCount) availableList.push(m) // 只有有还款数据的才会显示
                    })
                    availableList = availableList.splice(0, 3) // 最多就显示3项
                    this.setData({
                        paymentList: availableList
                    })
                }
            })
        },
        getTransactionLast() {
            app.api.getTransactionLast({
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
        getMemberList() {
            app.api.getMemberList({
                success: res => {
                    let data = res.payload || []
                    let merberNum = data.length
                    let cardNum = 0
                    data.map(m => {
                        cardNum += m.cardNum
                    })
                    this.setData({
                        merberNum,
                        cardNum
                    })
                }
            })
        },
        getCardListData() {
            let that = this
            app.api.getCard({
                success(res) {
                    if (res.error) return
                    res.payload.forEach(m => {
                        m.cityName = that.data.cityName
                        m.entryMode = 2
                        m.mccName = app.getMccName(m.vendorMcc)
                        m.cityName = app.getRegionName(m.vendorRegion, 1)
                        m.fullBankName = m.bankName
                        m.bankName = util.interceptStr(util.subBankName(m.bankName))
                        m.cardDisplayNo = util.hideCardNumber(m.cardNo)
                        m.shortName = util.interceptStr(m.name)
                        // m.vendorName = util.interceptStr(m.vendorName || '', 23)
                        m.formatCreditLimit = util.toNumbers(m.creditLimit, 0)
                        m.formatArrears = util.toNumbers(m.debt > 0 ? m.debt : 0, 2)
                        if (m.debt <= 0) {
                            m.debtPercent = 0
                        } else {
                            // m.debtPercent = util.toNumbers(m.debt / m.arrears, 1)
                            m.debtPercent = Number((m.debt * 100) / m.creditLimit).toFixed(2)
                        }
                        // 69.9%>=负债比例>=50.0%时，字体颜色为#FF9900，>=70%时，字体颜色为#FF6666
                        if (69.9 >= m.debtPercent && m.debtPercent >= 50.0) {
                            m.percentFontColor = '#FF9900'
                        }
                        if (m.debtPercent >= 70) {
                            m.percentFontColor = '#FF6666'
                        }
                        // 距下一还款日，<=3天时，天数字体颜色变为#FF6666
                        if (m.nextRepaymentInterval <= 3) {
                            m.dayFontColor = '#FF6666'
                        }
                    })
                    that.setData({
                        cardList: res.payload
                    })

                }
            })
        },
        gotoAdPage() {
            wx.navigateTo({
                url: '/package-a/card-installments-ad/card-installments-ad'
            })
        },
        gotoCardList() {
            wx.navigateTo({
                url: '/package-a/card-list/card-list'
            })
        },
        gotoAddCard() {
            let entryMode = 'addCard'
            wx.navigateTo({
                url: '/package-a/add-card/add-card?entryMode=' + entryMode + '&cardList=' + JSON.stringify(this.data.cardList)
            })
        },
        gotoStatistics() {
            wx.navigateTo({
                url: "/package-a/data-statistics/data-statistics"
            })
        },
        gotoRepaymentDocket() {
            wx.navigateTo({
                url: "/package-a/repayment-docket-list/repayment-docket-list"
            })
        },
    }
})