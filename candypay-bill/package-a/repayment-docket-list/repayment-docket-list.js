/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-06 14:17:31
 * @LastEditTime: 2019-05-21 14:47:28
 */
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        nopaddingtop: false,
        listData: []
    },
    onShow(){
        this.getRepaymentdocket()
    },
    onReady() {
        // this.getRepaymentdocket()
    },
    getRepaymentdocket() {
        app.api.getRepaymentdocket({
            success: res => {
                let listData = res.payload || []
                listData.forEach(m => {
                    m.start = false
                    m.end = false
                    m.remainStr = m.remain == 0 ? '今天' : '剩余' + m.remain + '天'
                    m.repaymentDateStr = util.timestampToTime(m.repaymentDate, 2).replace(/\-/g, '.').trim()
                    if (m.repaymentAmount < 0) m.repaymentAmount = 0
                    m.repaymentAmountStr = util.toNumbers(m.repaymentAmount)
                })
                listData[0].start = true
                listData[listData.length - 1].end = true

                this.setData({
                    nopaddingtop: listData[0].cardCount ? false : true,
                    listData
                })
            }
        })
    },
    gotoDetail(e){
        let item = e.currentTarget.dataset.item || {}
        let params = encodeURIComponent(JSON.stringify(item))
        wx.navigateTo({
            url: '/package-a/repayment-docket-detail/repayment-docket-detail?params=' + params
        })
    }
})