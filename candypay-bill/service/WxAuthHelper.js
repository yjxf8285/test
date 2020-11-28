import storageUtil from '../utils/storage-util'
import NaviCtrl from '../service/NaviController'
function getWechatLoginCode(caller) {
    wx.checkSession({
        success: res => {
            wechatLogin(caller)
        },
        fail() {
            caller.fail&&caller.fail('check wxLoginSession fail')
            wechatLogin(caller)
        }
    })
}


function wechatLogin(caller) {
    wx.login({
        success: res => {
            if (res.errMsg == 'login:ok') {
                caller.success&&caller.success(res.code)
            }
            else {
                caller.fail&&caller.fail('wechatLogin error && errMsg = ' + res.errMsg)
            }
        },
        fail() {
            wx.showModal({
                title: '错误',
                content: '登录微信失败！',
                showCancel: false,
            })
            caller.fail&&caller.fail('wechatLogin fail')
        }
    })
}

function wechatGetSetting(caller) {
    wx.getSetting({
        success: res => {
            if (res.errMsg == 'getSetting:ok') {
                caller.success&&caller.success(res)
            }
            else {
                caller.fail&&caller.fail('wechatGetSetting error && errMsg = ' + res.errMsg)
            }
        }, fail() {
            caller.fail&&caller.fail('wechatGetSetting fail')
        }
    })
}

function getWechatUserInfo(caller) {
    wechatGetSetting({
        success: res => {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                    success: res => {
                        if (res.errMsg == 'getUserInfo:ok') {
                            caller.success && caller.success(res)
                        }
                    },
                    fail() {
                        wx.showModal({
                            title: '错误',
                            content: '获取用户信息失败！',
                            showCancel: false,
                        })
                    }
                })
            } else {
                //调用界面处理
                NaviCtrl.wxRelaunch('/package-a/authorization/authorization', function (result) {
                    if (result.success = 'getUserInfo:ok') {
                        caller.success&&caller.success(result)
                    }
                })
            }
        }
    })
}

function getWechatUserLocationAuth(caller) {
    wechatGetSetting({
        success: res => {
            if (res.authSetting['scope.userLocation']) {
                caller.success&&caller.success()
            } else {
                wx.authorize({
                    scope: 'scope.userLocation',
                    success() {
                        caller.success&&caller.success()
                    },
                    fail() {
                        //调用界面处理,可以跳转到某个界面
                    }
                })
            }
        }
    })
}

module.exports = {
    getWechatLoginCode,
    wechatLogin,
    wechatGetSetting,
    getWechatUserInfo,
    getWechatUserLocationAuth
}
