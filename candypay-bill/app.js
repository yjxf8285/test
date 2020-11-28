/*
 * @Author: liuxiaofan
 * @Description: v3.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-05 16:51:50
 * @LastEditTime: 2020-05-08 13:51:33
 */
// 测试账号
// 微信号:13020012501
// 密码 Ab123456

import api from 'utils/api-server'
import EventBus from 'utils/eventbus'
import Config from 'config.js'


App({
    // 全局变量
    globalData: {
        name: '', //姓名
        idCard: '',//身份证号
        mobile: '',
        // 孙金凤	银行卡: 6225880351589545 身份证: 440114197002108400	手机: 16619772210  sn: 2020040812020022760157
        // 孙金凤·测试  银行卡: 6212266077099617740  身份证: 37140219810228010X  手机:  18444606112 sn: 2020040812020022760124
        // name: '孙金凤·测试', //姓名
        // idCard: '37140219810228010X',//身份证号
        // mobile: '18612341234',

        startDate: '',//身份证有效期
        endDate: '',//身份证有效期
        userId: '',
        authType: 'NEW_USERS', //OLD_USERS：老用户 NEW_USERS：新用户级 AUTHED：已认证
        isGuestUser: true,//是否是互联网用户
        registered: 'yes', //注册页面成功后赋值
        modeType: 'CARD', // 当前模式(简洁模式/卡模式)
        fromCardAccM: false,// 因为switchTab不支持传值，这里在全局定义个变量来判断是否从手账页面过来
        showIndexGuidePage: Config.showIndexGuidePage, // 进入首页时是否显示帮助页面
        adcode: '', // 定位获得的地区码
        accountList: [], //商户列表
        code: '',
        encryptedData: '',
        iv: '',
        userInfo: null,
        mccMap: [],//数据结构[{id,name,categoryId,categoryName}...]
        watingToBindSn: '', //通过扫码获取的sn码
        showOpenSetting: false,//仅展示一次，用一个Boolean做记录。提示之后设置为true,则不再提示用户
        versionName: Config.version,
        updateCardTime: 0//编辑卡片时间，存储格式为时间戳。 需要保存为全局变量，理由是用户可能关闭卡片编辑页面重新进入，此时时间保护仍需要生效。
    },
    // 监听globalData
    // watch: function (key, callback) {
    //     var obj = this.globalData;
    //     Object.defineProperty(obj, key, {
    //         configurable: true,
    //         enumerable: true,
    //         set: function (value) {
    //             this._name = value;
    //             callback(value);
    //         },
    //         get: function () {
    //             console.info('get name',this._name)
    //             // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
    //             return this._name
    //         }
    //     })
    // },
    api: api,
    fromAuth: false,
    onLaunch: function () {
        this.getConstants()
        this.manageUpdate() // 提示用户更新
        this.eb = new EventBus() // 发布订阅模式小工具
    },
    // 拿常量
    getConstants() {
        this.getRegion()
        this.getMcc()

    },
    manageUpdate() {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            showCancel: false,
                            success: function (res) {
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }
    },

    // // 显示app顶部loading
    // showAppLoading() {
    //     wx.setNavigationBarTitle({
    //         title: '加载中'
    //     })
    //     wx.showNavigationBarLoading()
    // },
    // // 隐藏顶部loading
    // hideAppLoading(title = '开店宝账单') {
    //     wx.setNavigationBarTitle({
    //         title
    //     })
    //     wx.hideNavigationBarLoading()
    // },
    // 设置帮助页的显示逻辑
    setGuidePageView() {
        let isGuestUser = this.globalData.isGuestUser
        if (
            !this.globalData.watingToBindSn && // 非扫码进来的
            !isGuestUser && // 专业版用户
            this.globalData.showIndexGuidePage // 显示开关打开
        ) {
            wx.navigateTo({
                url: "/package-a/guide/guide"
            })
        }
    },
    // 获取微信授权状态 
    getWxAuthorized(cb) {
        let that = this
        wx.getSetting({
            success: res => {
                let authSetting = res.authSetting || {}
                let authorized = authSetting['scope.userInfo'] ? true : false
                cb(authorized)
                // 不管什么情况，只要未授权就去跳转到授权页面
                if (!authorized) {
                    that.gotoAuthorization()
                }
            },
            fail(res) {
                wx.showModal({
                    title: '错误',
                    content: '获取微信授权信息失败',
                    showCancel: false,
                })
                wx.hideLoading()
                cb(false)
                // 不管什么情况，只要未授权就去跳转到授权页面
                that.gotoAuthorization()
            }
        })
    },
    // 跳转到授权页
    gotoAuthorization() {
        wx.reLaunch({
            url: '/package-a/authorization/authorization'
        })
    },

    // 地区列表
    getRegion(cb) {
        let that = this
        let regionList = wx.getStorageSync('regionList')
        if (regionList) return
        this.api.region({
            success(res) {
                wx.setStorageSync('regionList', res.payload)
                that.eb.emit('getRegion', res.payload)
                cb && cb(res.payload)
            }
        })
    },
    // mcc列表
    getMcc(cb) {
        let that = this
        let mccList = wx.getStorageSync('mccList')
        if (!mccList) {
            this.api.getMcc({
                success(res) {
                    wx.setStorageSync('mccList', res.payload)
                    that.globalData.mccMap = res.payload
                    cb && cb(res.payload)
                }
            })
        }
    },
    // 定位相关
    scopeLocation(caller) {
        let that = this
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        fail() {
                            if (!that.globalData.showOpenSetting) {
                                wx.showModal({
                                    title: '缺少获取地理位置权限',
                                    content: '请在设置页面打开地理位置选项',
                                    showCancel: true,
                                    confirmText: '去设置',
                                    success: function (res) {
                                        if (!res.confirm) {
                                            return;
                                        }
                                        wx.navigateTo({
                                            url: '/package-a/open-setting/open-setting'
                                        })
                                    }
                                })

                            }
                            that.globalData.showOpenSetting = true
                        },
                        success() {
                            caller.scopeLocationSuccess()
                        }
                    })
                }
                else {
                    caller.scopeLocationSuccess()
                }
            }
        })
    },
    //根据regid获取对应的省市名称
    getRegionName(cityId = 0, cityOnly = false, provinceOnly = false) {
        let provinceId = (cityId + '').slice(0, 2) //省码
        let provinceName = ''
        let cityName = ''
        let result = ''
        let regionList = wx.getStorageSync('regionList') || []

        regionList.forEach(m => {
            if (m.id.length <= 2) {
                if (m.id == provinceId) {
                    provinceName = m.name
                }
            } else {
                if (m.id == cityId) {
                    cityName = m.name
                }
            }

        })

        if (provinceOnly) {
            result = provinceName || '无'
        } else {
            if (cityOnly) {
                result = cityName || '无'
            } else {
                result = provinceName || '无' + ' ' + cityName || '无'
            }

        }

        return result

    },
    //根据groupId获取mccId
    getMccId(groupId) {
        if (!groupId) return ''
        let result = ''
        let mccList = wx.getStorageSync('mccList') || []
        mccList.forEach(m => {
            if (m.group == groupId) {
                result = m
            }
        })
        return result

    },
    // 根据mccId获取对应数据
    getMccData(mccId) {
        if (!mccId) return {}
        let result = {}
        let mccList = wx.getStorageSync('mccList') || []
        mccList.forEach(m => {
            if (m.id == mccId) {
                result = m
            }
        })
        return result
    },
    //根据mccId获取对应 大类+子类名称
    getMccName(mccId) {
        if (!mccId) return '无'
        let result = ''
        let mccList = wx.getStorageSync('mccList') || []
        mccList.forEach(m => {
            if (m.id == mccId) {
                result = m
            }
        })
        if (result) {
            return result.categoryName + ' ' + result.groupName
        } else {
            return '无'
        }
    },
    //根据mccId获取对应 子类名称
    getMccCategoryName(mccId) {
        if (!mccId) return '无'
        let result = ''
        let mccList = wx.getStorageSync('mccList') || []
        mccList.forEach(m => {
            if (m.id == mccId) {
                result = m
            }
        })
        if (result) {
            return result.categoryName
        } else {
            return '无'
        }
    },
    //根据mccId获取对应 大类名称
    getMccGroupName(mccId) {
        try {
            if (!mccId) return '无'
            let result = ''
            let mccList = wx.getStorageSync('mccList') || []
            mccList.forEach(m => {
                if (m.id == mccId) {
                    result = m
                }
            })
            if (result) {
                return result.groupName || ''
            } else {
                return '无'
            }
        }
        catch (exception) {
            console.log('getMccGroupName error', exception)
        }

    },

    // 设置滑动提示按钮的隐藏和显示
    setBtnvisual(type) {
        this.eb.emit('setBtnvisual', type)
    },


})