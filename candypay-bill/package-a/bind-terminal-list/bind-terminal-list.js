/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2020-03-30 14:34:58
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-28 14:53:04
 */
const app = getApp()
import util from '../../utils/util.js'
Page({
    data: {
        terminalList: []
    },
    onShow() {
        this.getTerminalList()
    },
    onLoad(opt) {

    },
    getTerminalList() {
        let that = this
        app.api.getMerchantList({
            params: {
                idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                requestType: 'POSLIST'
            },
            success(res) {
                let payload = res.payload || {}
                let accountInfos = payload.accountInfos || []
                accountInfos.forEach((item, i) => {
                    item.number = item.devices.length || 0
                    item.date = util.timestampToTime(item.createTime, 2)
                })
                that.setData({
                    terminalList: accountInfos
                })
            }
        })
    },
    gotoDetailPage(e) {
        let item = e.currentTarget.dataset.item || {}
        item.sourcePage = 'bindterminal' //页面来源
        let params = encodeURIComponent(JSON.stringify(item))
        wx.navigateTo({
            url: '/package-a/bind-terminal-detail/bind-terminal-detail?params=' + params
        })
    }
})