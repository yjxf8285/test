/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-07 20:01:22
 * @LastEditTime: 2019-08-13 14:39:08
 */
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        memberList: [],
        currentMember: {
            name: '全部',
            idCard: ''
        },
        cardList: [],
        availableLimit: '',
        debt: '',
        freeInteval: '',
        nextRepaymentInterval: true,
    },

    onShow() {
        this.getMemberList()
        // reset filter condition while page on show
        // this.setDefautState()
    },
    setDefautState() {
        this.setData({
            currentMember: {
                name: '全部',
                idCard: ''
            },
            availableLimit: '',
            debt: '',
            freeInteval: '',
            nextRepaymentInterval: true,
        })
    },
    getMemberList() {
        app.api.getMemberList({
            success: res => {
                let memberList = res.payload || []
                this.setData({
                    // currentMember: memberList[0],
                    memberList: [{
                        name: '全部',
                        idCard: ''
                    }, ...memberList]
                })
                this.getCardListSearch()
            }
        })
    },
    selectMember({ detail }) {
        let memberList = this.data.memberList
        let currentMember = memberList[detail.value]
        this.setData({
            cardList: [], // 每次切换先清空列表
            availableLimit: '',
            debt: '',
            freeInteval: '',
            nextRepaymentInterval: true,
            currentMember
        })
        this.getCardListSearch()
    },
    getCardListSearch() {
        app.api.getCardListSearch({
            params: {
                idCard: this.data.currentMember.idCard,
                availableLimit: this.data.availableLimit,
                debt: this.data.debt,
                freeInteval: this.data.freeInteval,
                nextRepaymentInterval: this.data.nextRepaymentInterval
            },
            success: res => {
                let cardList = res.payload || []
                this.setData({
                    cardList: this.formatList(cardList)
                })
            }
        })
    },
    formatList(originData = []) {
        originData.forEach(m => {
            if (m.availableLimit < 0) {
                m.availableLimit = 0
            }
            m.availableLimitStr = util.toNumbers(m.availableLimit)
            m.occurTime = util.timestampToTime(m.occurTime)
            m.hidecardNo = util.hideCardNumber(m.cardNo, 8)
            m.bankImg = util.getBankLogo(m.groupId)
            m.debtPercent = Number((m.debt * 100) / m.creditLimit).toFixed(2)
            m.curDay = Number(util.getNowDate(6))
            m.currClosingDateStr = util.timestampToTime(m.currClosingDate, 3).replace('-',
                '月')
            m.currRepaymentDateStr = util.timestampToTime(m.currRepaymentDate, 3).replace('-',
                '月')


            m.progress = m.debtPercent * 1.8
            if (m.progress >= 180) m.progress = 180 // 最大180
            if (m.progress <= 0) m.progress = 0 // 最小0 
            if (m.debtPercent <= 0) {
                m.debtPercent = '0.0'
            }
            let barColor = '4CB90C'
            let percent = m.debtPercent //负债比
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
            if (percent < 0) {
                percent = 0
                progress = 0
            }
            m.monthSummary = {
                barColor,
                progress,
                percent: percent.toFixed(2),
            }

        });
        return originData
    },
    sortBtnClick({ currentTarget }) {
        let s = ''
        let sortTypeName = currentTarget.id
        switch (this.data[sortTypeName]) {
            case true: s = false
                break
            case false: s = ''
                break
            case '': s = true
                break
        }
        this.setData({
            [sortTypeName]: s
        })
        this.getCardListSearch()
    },
    // 组织好数据后才传参
    gotoCardAccounting(e) {
        let item = e.currentTarget.dataset.item || {}
        let params = encodeURIComponent(JSON.stringify(item))
        wx.navigateTo({
            url: '/package-a/card-accounting/card-accounting?params=' + params
        })
    },
    gotoAddCard() {
        let entryMode = 'addCard'
        wx.navigateTo({
            url: '/package-a/add-card/add-card?entryMode=' + entryMode + '&cardList=' + JSON.stringify(this.data.cardList)
        })
    },
})
