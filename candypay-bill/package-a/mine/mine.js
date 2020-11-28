/*
 * @Author: Liuxiaofan 
 * @Date: 2018-08-13 17:51:29 
 * @Last Modified by: Hu
 * @Last Modified time: 2018-12-03 09:27:08
 */

import wxAuthHelper from '../../service/WxAuthHelper'
const util = require('../../utils/util.js') //只能是相对路径
const app = getApp()
Page({
    data: {
        userInfo: {
            isGuestUser: true,
            nickName: '',
            avatar: ''
        },
        versionName: ''
        // icon_header:'../../image/icons/icon_user_nor@3x.png'
    },
    onLoad: function () {
        let that = this
        app.getWxAuthorized(isAuthorized => {
            if (!isAuthorized) return // 没授权就打断
            this.setUserInfo()
        })

    },
    setUserInfo() {
        let that = this
        wxAuthHelper.getWechatUserInfo({
            success(result) {
                that.setData({
                    userInfo: {
                        isGuestUser: app.globalData.isGuestUser,
                        nickName: result.userInfo.nickName,
                        avatar: result.userInfo.avatarUrl
                    },
                    versionName: app.globalData.versionName

                })
            }
        })
    },
    gotoAccount: function () {
        wx.navigateTo({
            url: 'account/account'
        })
    },
    gotoMemberList: function () {
        wx.navigateTo({
            url: 'member-list/member-list'
        })
    },
    gotoCard: function () {
        wx.navigateTo({
            url: 'card/card'
        })
    },
    goGuidePage: function () {
        wx.navigateTo({
            url: "/package-a/guide/guide"
        })
    },
    gotoGuide() {
        wx.navigateTo({
            url: "/package-a/help/help"
        })
    }
});