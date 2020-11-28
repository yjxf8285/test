/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-10-31 09:41:45
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-26 15:42:00
 */
/**
 * 请求sign状态的一个工具，旨在解决登录获取token流程逻辑复杂问题，以及token的有效期为24h而因此出现的有效期过期的问题。
 * 原先的token检查仅仅app开启时做了一次，使用该工具侵入app-server.js后可以在任何请求之前都校验token是否有效，并且触发相应流程。
 * 具体为：
 *      sign状态校验，如果token可用，那么认为sign状态为真，会给调用者一个响应。
 *      如果token不可用，则认为sign状态为假 ，触发sign流程。
 *      在sign流程中，会先check微信的用户权限，如果没有用户权限，则触发获取用户权限流程。获取到用户权限，回到sign流程。
 *      在sign流程中，如果server返回用户未注册的状态，则触发注册界面流程。 在注册界面流程会获取token传递回来。
 * 最终，无论触发哪一个流程，都会在返回token的时候，把请求sign状态的调用者都触发他们的signInCallback函数
 * 
 * 该工具需要在authorization.js和user-register.js中有回调函数来驱动
 * 该类只需侵入app-server.js一部分请求逻辑，既在请求开始时调用checkSignStatus，倘若signInCallback被回调，则http请求继续执行。
 */
import tokenUtil from '../utils/storage-util'
import api from '../utils/api-server'
import wxAuthHelper from '../service/WxAuthHelper'
import NaviCtrl from '../service/NaviController'
var signInCallbacks = [];//sign状态的回调队列
var isInSignProcess = false;//是否在进行sign流程状态的锁。如果请求登录状态时，已经有别的请求先进行了登录，那仅仅把该请求放入回调队列里。
const CHECK_OK = 1;
const CHECK_REJECTED = 2;
function checkSignStatus(caller) {

    if (tokenUtil.isTokenValid() || caller.block == 'beforeSignin') {
        caller.signInCallback(CHECK_OK);
    }
    else {
        if (caller.block == 'single') {
            //如果该请求需要保证唯一，那么需要检查请求队列，并且去重
            let isSame = false
            signInCallbacks.forEach(callback => {
                if (callback.url == caller.url) {
                    caller.signInCallback(CHECK_REJECTED);
                    isSame = true
                }
            })
            if (isSame) {
                return
            }
        }
        signInCallbacks.push(caller)
        //没有存储token或者token过期,需要重新获取微信的code 和data以及iv进行signin
        if (isInSignProcess != false) {
            return;
        }
        preSignin()
    }
}


function preSignin() {
    // console.log('calling method doSignin')
    isInSignProcess = true;
    tokenUtil.clearTokenCache()
    wxAuthHelper.getWechatLoginCode({
        success: code => {
            wxAuthHelper.getWechatUserInfo({
                success: res => {
                    doSignin(code, res.encryptedData, res.iv)
                },
                fail: errMsg => {
                    console.log(errMsg)
                }
            })
        }, fail: errMsg => {
            // wx.showModal({
            //     title: '错误',
            //     content: '微信网络请求失败：'+errMsg,
            //     showCancel: false,
            // })
            console.log('微信登录接口失败-wx.login', errMsg)
        }
    })
}

function doSignin(cod, encryptedData, iv) {
    api.signin({
        data: {
            code: cod,
            data: encryptedData,
            iv: iv
        },
        success(res) {
            tokenUtil.setToken(res.payload.token)
            // res.payload.result = 'UNREGISTERED'
            // console.log('api.singin -> response:',res)
            if (res.payload.result == 'UNREGISTERED') {
                wx.setStorageSync('registered', 'no')
                setTimeout(res => {

                    NaviCtrl.wxRelaunch('/package-a/register/user-register/user-register', function (result) {
                        console.log('通过注册 signin完成')
                        tokenUtil.setToken(result)
                        tokenUtil.setCurrentTokenTime()
                        setTokenComplete()
                    })
                }, 100)

                return
            } else {
                wx.setStorageSync('registered', 'yes')
                tokenUtil.setCurrentTokenTime()
                setTokenComplete()
            }
        }
    })
}
// 只有signin接口请求成功之后才会执行其他接口，否则都要先存到队列数组中等待
function setTokenComplete() {
    // console.log('calling method setTokenComplete')
    signInCallbacks.forEach(callback => {
        callback.signInCallback(CHECK_OK)
    })
    signInCallbacks = []
    isInSignProcess = false;
}
module.exports = {
    checkSignStatus,
    CHECK_OK,
    CHECK_REJECTED
}
