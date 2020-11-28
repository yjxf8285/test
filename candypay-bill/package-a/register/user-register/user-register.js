/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-03-23 15:53:49
 */

const app = getApp()
const util = require('../../../utils/util.js')
import validate from '../../../utils/validate.js'
import NaviCtrl from '../../../service/NaviController'

Page({
    data: {
        agreement: true,
        phoneNum: '',
        verifyCode: 0,
        password: '',
        getVerifyCodeTxt: '发送验证码',
        sendCodeBtnDisable: false,
        sendCodeBtnDisableColor: "#ffffff",
        registerMode: 0, // 0是注册流程: signin-->verification--success-->signup  //1是动态密码流程: signin--->verification--->falied--->ticket--->bind
        icon_phone: '/image/register/icon_phone.png',
        icon_code: '/image/register/icon_code.png',
        image_bg: '/image/register/image_bg.png',
        callbackId: undefined,
    },
    onLoad(opt) {
        if (opt.id != undefined) {
            this.setData({
                callbackId: opt.id
            })
        }
    },
    setphoneNum(e) {
        //只要改动过了手机号，那么一定要让注册流程切换回原有的流程。
        this.setData({
            phoneNum: e.detail.value,
            registerMode: 0
        })
    },
    setverifyCode(e) {
        this.setData({
            verifyCode: e.detail.value
        })
    },
    getVerifyCode() {
        console.log('registerMode = %s ', this.data.registerMode)
        if (!validate.isPhoneAvailable(this.data.phoneNum)) {
            util.showToast('请输入正确的手机号码')
            return;
        }
        if (this.data.registerMode == 0) {
            this.sendVerifyCode();
        }
        else if (this.data.registerMode == 1) {
            this.sendTicket();
        }

    },

    nextStep() {
        if (!validate.isPhoneAvailable(this.data.phoneNum)) {
            util.showToast('请输入正确的手机号码')
            return;
        }
        if (this.data.verifyCode == 0) {
            util.showToast('请输入验证码')
            return;
        }
        if (this.data.registerMode == 0) {
            this.signup();
        }
        else if (this.data.registerMode == 1) {
            this.bind();
        }
    },

    signup() {
        let mobile = this.data.phoneNum
        let code = this.data.verifyCode
        let that = this
        app.api.signup({
            data: {
                mobile: mobile,
                code: code
            },
            success(data) {
                app.globalData.registered = 'yes'
                wx.setStorageSync('registered', 'yes')
                //绑定成功，需要保存token执行跳转
                that.returnIndex(data.payload.token)
            }
        }, function (res) {
            if (res.data.payload == 'invalid_code' || res.data.payload == 'unauthorized') {
                wx.showModal({
                    title: '错误',
                    content: '验证码输入错误',
                    showCancel: false,
                })
            }
        })
    },

    sendVerifyCode() {
        let that = this
        let mobile = this.data.phoneNum
        app.api.verification({
            data: {
                mobile: mobile,
            },
            success(data) {
                if (data.payload == 'success') {
                    wx.showModal({
                        title: '提示',
                        content: '发送成功！',
                        showCancel: false,
                    })
                    that.sendSmsSuccess()
                }
            }
        }, function (res) {
            if (res.data.error == 'registered_mobile') {
                wx.showModal({
                    title: '提示',
                    content: res.data.payload + '，是否需要继续绑定该手机号码？',
                    showCancel: true,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击了确定')
                            that.setData({
                                registerMode: 1
                            })
                            that.sendTicket();//用户点击了确定，自动切换到
                        }
                        if (res.cancel) {
                            console.log('用户点击了取消')
                        }
                    }
                })
            }
        })
    }
    ,
    sendTicket() {
        console.log('走动态密码流程')
        let that = this
        let mobile = this.data.phoneNum
        app.api.ticket({
            data: {
                mobile: mobile,
            },
            success(data) {
                if (data.payload == 'success') {
                    wx.showModal({
                        title: '提示',
                        content: '发送成功！',
                        showCancel: false,
                    })
                    that.sendSmsSuccess()
                }
            }
        })
    }
    ,

    bind() {
        let mobile = this.data.phoneNum
        let code = this.data.verifyCode
        let that = this
        app.api.binding({

            data: {
                mobile: mobile,
                code: code
            },
            success(data) {
                app.globalData.registered = 'yes'
                wx.setStorageSync('registered', 'yes')
                //绑定成功，需要保存token执行跳转
                that.returnIndex(data.payload.token)
            }
        }, function (res) {
            if (res.data.payload == 'invalid_code' || res.data.payload == 'unauthorized') {
                wx.showModal({
                    title: '错误',
                    content: '验证码输入错误',
                    showCancel: false,
                })
            }
        })
    }

    , sendSmsSuccess() {
        console.log('开始倒计时')
        this.countDown(this, 60);

    },

    countDown(that, count) {

        if (count == 0) {
            that.setData({
                getVerifyCodeTxt: '获取验证码',
                sendCodeBtnDisable: false
            })
            return;
        }

        that.setData({
            sendCodeBtnDisable: true,
            getVerifyCodeTxt: count + 's',
        })

        setTimeout(function () {
            count--;
            that.countDown(that, count);
        }, 1000);
    },
    returnIndex(token) {
        if (this.data.callbackId != undefined && this.data.callbackId != null) {
            NaviCtrl.wxRelaunchPageFinish(this.data.callbackId, token)
        }
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    gotoUserAgreement() {
        wx.navigateTo({
            url: '/package-a/user-agreement/user-agreement'
        })
    },
    switchAgreement() {
        this.setData({
            agreement: !this.data.agreement
        })
    }
})