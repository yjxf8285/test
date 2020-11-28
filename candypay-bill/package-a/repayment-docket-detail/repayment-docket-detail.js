/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-06 14:17:31
 * @LastEditTime: 2019-05-21 14:48:50
 */
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        currentItem: '',
        disabled: 'disabled',
        totalRepaymentAmountStr: 0.00,
        repaymentDateStr: '0年0月0日',
        repaymentDate: '',
        remain: '',
        cardList: []
    },

    onLoad(opt) {
        let p = decodeURIComponent(opt.params || '')
        p = JSON.parse(p || '{}')
        // p = { "repaymentDate": 1553616000000, "remain": 10, "cardCount": 1, "repaymentAmount": 0, "start": true, "end": false, "remainStr": "今天", "repaymentDateStr": "2019.03.27", "repaymentAmountStr": "0.00" }

        let repaymentDateStr = util.timestampToTime(p.repaymentDate || '', 2)
        repaymentDateStr = util.formatDateStr(repaymentDateStr) //把-分割变成月日年
        this.setData({
            repaymentDate: p.repaymentDate || '',
            repaymentDateStr,
            remain: p.remain || 0
        })
        this.getRepaymentdocketdetail()
    },
    onReady() {

    },
    getRepaymentdocketdetail() {
        let repaymentDate = util.timestampToTime(this.data.repaymentDate || '', 2)
        app.api.getRepaymentdocketdetail({
            params: {
                repaymentDate: repaymentDate.replace(/-/g, ''),
                remain: this.data.remain
            },
            success: res => {
                let data = res.payload || {}
                if (data.totalRepaymentAmount < 0) data.totalRepaymentAmount = 0
                let totalRepaymentAmountStr = util.toNumbers(data.totalRepaymentAmount)
                data.cardList.forEach(m => {
                    m.selected = false
                    m.hidecardNo = util.hideCardNumber(m.cardNo)
                    m.bankImg = util.getBankLogo(m.groupId)
                    if (m.repaymentAmount < 0) m.repaymentAmount = 0
                    m.repaymentAmountStr = util.toNumbers(m.repaymentAmount)
                });
                this.setData({
                    totalRepaymentAmountStr,
                    cardList: data.cardList || []
                })
            }
        })
    },
    selectItem(e) {
        let item = e.currentTarget.dataset.item
        let cardList = this.data.cardList
        cardList.forEach(m => {
            m.selected = false // 单选
            if (m.cardNo == item.cardNo) {
                m.selected = !m.selected
            }
        });

        this.setData({
            currentItem: item,
            disabled: '',
            cardList
        })
    },
    gotoRepay() {
        let currentItem = this.data.currentItem || {}
        let params = encodeURIComponent(JSON.stringify(currentItem))
        if (!currentItem.cardNo) return
        wx.navigateTo({
            url: '/package-a/card-acc-torepay/card-acc-torepay?params=' + params
        })
    }
})