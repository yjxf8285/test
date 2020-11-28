/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-26 15:01:40
 * @LastEditTime: 2020-05-06 17:53:50
 */
import wxAuthHelper from '../../service/WxAuthHelper'
const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        isGuestUser: 1,
        authType: 'NEW_USERS', //OLD_USERS：老用户 NEW_USERS：新用户级 AUTHED：已认证
        modeType: 'CARD', // 当前模式(简洁模式/卡模式)
        mobile: '',
        accountList: [],
        sn: '124124121',
        patternName: '卡片模式',
        userInfo: {
            nickName: '',
            avatar: ''
        },
    },
    pageLifetimes: {
        show() {
            app.getWxAuthorized(isAuthorized => {
                if (!isAuthorized) return // 没授权就打断
                this.setUserInfo() //先设置头像
                // 判断是否已经注册
                let registered = wx.getStorageSync('registered') || 'yes' // 
                if (registered != 'yes') {
                    wx.reLaunch({
                        url: '/package-a/register/user-register/user-register'
                    })
                }
                this.getUserDetail()// 现请求认证状态和手机号，然后再获取默认商户
            })
        }
    },
    methods: {
        // 先判断是否是互联网用户，如果不是则根据modeType，切换对应的模式
        getMerchantList() {
            let that = this
            let idCard = app.globalData.idCard || ''
            app.api.getMerchantList({
                params: {
                    idCard, //如果认证过的商户就需要传身份证
                    requestType: 'TRANSICATION'
                },
                success: res => {
                    let data = res.payload || {}
                    let accountInfos = data.accountInfos || []
                    let totalAmount = data.totalAmount || 0
                    let totalLimitAmount = data.totalLimitAmount || 0
                    // accountInfos = []
                    let modeType = 'CARD'
                    if (accountInfos && accountInfos.length > 0) {
                        modeType = accountInfos[0].modeType
                        app.globalData.isGuestUser = false
                    } else {
                        app.globalData.isGuestUser = true
                    }
                    let patternName = (modeType == 'CARD') ? '卡片模式' : '简洁模式'
                    app.globalData.accountList = accountInfos || []
                    app.globalData.totalAmount = totalAmount
                    app.globalData.totalLimitAmount = totalLimitAmount
                    app.globalData.modeType = modeType
                    that.setData({
                        isGuestUser: app.globalData.isGuestUser,
                        modeType,
                        patternName,
                        accountList: app.globalData.accountList
                    })
                    app.setGuidePageView()
                }
            })
        },
        setUserInfo() {
            let that = this
            wxAuthHelper.getWechatUserInfo({
                success: result => {
                    that.setData({
                        userInfo: {
                            nickName: result.userInfo.nickName,
                            avatar: result.userInfo.avatarUrl
                        }
                    })
                }
            })
        },
        // 显示切换模式确认框
        showModal() {
            if (this.data.isGuestUser) return
            let content = (this.data.modeType == 'CARD') ? '当前为“卡片模式”，确定切换至“简洁模式”吗？' : '当前为“简洁模式”，确定切换至“卡片模式”吗？'
            wx.showModal({
                title: '提示',
                content,
                success: (res) => {
                    if (!res.confirm) return
                    this.switchPattern()
                }
            })
        },
        switchPattern() {
            let antiModeType = (this.data.modeType == 'CARD') ? 'DEVICE' : 'CARD'
            app.api.switchModeType({
                params: {
                    modeType: antiModeType
                },
                success: res => {

                    let patternName = (antiModeType == 'CARD') ? '卡片模式' : '简洁模式'
                    app.globalData.modeType = antiModeType
                    this.setData({
                        modeType: antiModeType,
                        patternName
                    })
                }
            })
        },
        getUserDetail() {
            let that = this
            app.api.userDetail({
                success: res => {
                    let payload = res.payload || {}
                    Object.assign(app.globalData, {
                        startDate: payload.startDate,
                        endDate: payload.endDate,
                        userId: payload.userId,
                        authType: payload.authType,
                        name: payload.name,
                        idCard: payload.idCard,
                        mobile: payload.mobile,
                    })
                    this.setData({
                        authType: payload.authType,
                        mobile: payload.mobile,
                    })
                    that.getMerchantList()
                }
            })
        },
        // // sn 解密
        // deviceDecryption(deSn = '', callback) {
        //     app.api.getAccountByEncSn({
        //         url: 'device/decryption/' + deSn,
        //         success(res) {
        //             callback(res.payload)
        //         }
        //     })
        // },
        // // sn 加密
        // deviceEncryption(enSn = '', callback) {
        //     //1231231230100644
        //     app.api.getDeviceEncryption({
        //         url: 'device/encryption/' + enSn,
        //         success(res) {
        //             callback(res.payload)
        //         }
        //     })
        // },

        gotoRealNameAuthenticationPage() {
            wx.navigateTo({
                url: '/package-a/real-name-authentication/real-name-authentication'
            })
        },
        gotoAccountListPage() {
            wx.navigateTo({
                url: "/package-a/account-list/account-list"
            })
        },
        gotoMine() {
            wx.navigateTo({
                url: "/package-a/mine/mine"
            })
        }
    }
})