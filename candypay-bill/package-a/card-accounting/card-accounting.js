/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-06 14:17:31
 * @LastEditTime: 2019-08-22 17:43:39
 */
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        // 页面控制
        swiperIndex: 0, //  0详情 1记账
        entryMode: 1, // 1代表设备；2代表卡片；3代表圈子
        cardNo: '',
        cardData: {}, // 进来的卡片数据
        showSwiperBtn: false,
        btnSmall: false
    },
    onShow() {
        this.getCardListSearch()
    },
    onLoad(opt) {
        let p = decodeURIComponent(opt.params || '')
        let params = JSON.parse(p || '{}')
        this.setData({
            cardData: params,
            cardNo: params.cardNo
        })
        // this.getCardListSearch()
    },
    onReady() {
        let that = this
        // 解决内部组件遮罩层级过低遮不住滑动按钮的问题
        app.eb.on('setBtnvisual', function (type) {
            that.setData({
                showSwiperBtn: type
            })
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
            item.merchantRegion = app.globalData.accountList[0].merchantRegion
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
    setBtntoSmall() {
        this.setData({
            btnSmall: true
        })
    },
    swipeClick({ currentTarget }) {
        this.setData({
            swiperIndex: currentTarget.dataset.type
        })
        this.setBtntoSmall()
    },
    swiperChange({ detail }) {
        let current = detail.current
        switch (current) {
            case 0:
                wx.setNavigationBarTitle({
                    title: '卡片详情'
                })
                this.setData({
                    swiperIndex: current
                })
                break
            case 1:
                wx.setNavigationBarTitle({
                    title: '记一笔'
                })
                this.setData({
                    swiperIndex: current
                })
                this.setBtntoSmall()
                break
        }
    },

})