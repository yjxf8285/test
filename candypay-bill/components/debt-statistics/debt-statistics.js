/* 
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-05-21 18:58:16
 */
const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        currentMember: {
            name: '',
            idCard: ''
        },
        memberList: [],
        monthSummary: {
            limitAmount: 0,
            expense: 0,
            totalAvailable: 0,
        },
        limtanddebtList: []
    },
    pageLifetimes: {
        show() {
            this.getMemberList()
            this.getCurrentMonthIncomeExpense()
            this.getCurrentMonthLimtanddebt()
        }
    },
    ready() {
        this.getMemberList()
        this.getCurrentMonthIncomeExpense()
        this.getCurrentMonthLimtanddebt()
    },
    methods: {
        getMemberList() {
            app.api.getMemberList({
                success: res => {
                    this.setData({
                        memberList: [{
                            name: '全部成员',
                            idCard: ''
                        }, ...res.payload]
                    })
                }
            })
        },
        selectMember({ detail }) {
            let memberList = this.data.memberList
            let currentMember = memberList[detail.value]
            this.setData({
                currentMember
            })
            this.getCurrentMonthIncomeExpense()
            this.getCurrentMonthLimtanddebt()
        },
        // 当月汇总
        getCurrentMonthIncomeExpense() {
            app.api.getCurrentMonthIncomeExpense({
                params: {
                    idCard: this.data.currentMember.idCard,
                },
                success: res => {
                    let data = res.payload
                    if (util.isEmpty(data)) return
                    // this.circleProgressPie.setChartOption([data.debtAmount, data.limitAmount]) // 传入饼图数据

                    // 笔数：incomeTransactions+expenseTransactions
                    // 总授信额度： limitAmount
                    // 费用合计：commissions
                    // 总消费：expense
                    // 总可用额度：availableLimit
                    // 总负债：debtAmount
                    // 总负债比 debtAmount/limitAmount
                    let percent = Number(data.debtAmount * 100 / data.limitAmount) //负债比
                    let progress = percent * 3.6 //提前转换好，因为目前基础库版本不支持组件的watch功能，所以很多计算不建议在组件内部实现。
                    if (progress >= 360) progress = 360 // 最大360
                    let totalAvailable = util.toNumbers(data.availableLimit)
                    if (data.debtAmount < 0) data.debtAmount = 0
                    let barColor = '4CB90C'
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
                    if (percent < 0) {
                        percent = '0.00'
                        progress = 0
                    }
                    if (isNaN(percent)) {
                        percent = '0.00'
                    }
                    percent = Number(percent) // 因为上面变成了'0.00' 这里还需要再转一下数据类型
                    this.setData({
                        monthSummary: {
                            ym: util.getNowDate(5),
                            progress,
                            percent:percent.toFixed(2),
                            barColor,
                            transactions: data.incomeTransactions + data.expenseTransactions,
                            limitAmount: util.toNumbers(data.limitAmount),
                            commissions: util.toNumbers(data.commissions),
                            expense: util.toNumbers(data.expense),
                            debtAmount: util.toNumbers(data.debtAmount),
                            totalAvailable
                        }
                    })
                }
            })
        },
        getCurrentMonthLimtanddebt() {
            app.api.getCurrentMonthLimtanddebt({
                params: {
                    idCard: this.data.currentMember.idCard,
                },
                success: res => {
                    let limtanddebtList = res.payload
                    if (util.isEmpty(limtanddebtList)) return
                    limtanddebtList.forEach(m => {
                        m.percent = Number(m.debtAmount * 100 / m.limitAmount).toFixed(2) //负债比
                        // m.debtAmount = util.toNumbers(m.debtAmount)
                        m.debtAmountStr = (m.debtAmount / 1000).toFixed(2)
                        m.limitAmountStr = (m.limitAmount / 1000).toFixed(2)
                    });
                    this.setData({
                        limtanddebtList
                    })
                }
            })
        }
    }
})