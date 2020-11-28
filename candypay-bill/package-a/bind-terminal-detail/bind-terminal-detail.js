/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2020-03-30 14:34:58
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-05-08 13:36:59
 */
const app = getApp()
import util from '../../utils/util.js'
import validate from '../../utils/validate.js'
Page({
    data: {
        tusn: '',
        merchantId: '',
        merchantName: '',
        createTime: '',
        sourcePage: 'bindterminal', //页面来源做区别 bindterminal/addsettlement
        editable: true
    },
    onShow() {
    },
    onLoad(options) {
        let p = decodeURIComponent(options.params || '')
        let params = {}
        try {
            params = JSON.parse(p || '{}')
        }
        catch (exception) {
            wx.showModal({
                title: '数据错误',
                content: '错误代码：' + p,
                showCancel: false,
            })
            console.log(exception)
            return
        }
        this.setData({
            sourcePage: params.sourcePage || '',
            merchantId: params.merchantId || '86101511624',
            merchantName: params.merchantName || '',
            createTime: util.timestampToTime(params.createTime || '', 2),
        })
    },
    scanCode() {
        let that = this
        util.scanBarCode(tusn => {
            that.setData({
                tusn
            })
        })
    },
    setTusn(e) {
        let tusn = this.data.tusn
        if (validate.letterOrNumber(e.detail.value)) {
            tusn = e.detail.value
        }
        this.setData({ tusn })
    },
    // 校验sn是否合法 2019061719040923
    deviceCheck() {
        let that = this
        let tusn = this.data.tusn
        if (this.data.tusn == '') return false
        app.api.deviceCheck(
            {
                params: {
                    sn: tusn,
                    merchantId: this.data.merchantId || ''
                },
                success(res) {
                    setTimeout(m => {
                        that.bindDevice()
                    }, 300) //延迟300毫秒保证第2次请求的loading遮罩不消失

                }
            }
            // ,err => {
            //     console.info(1)
            //     setTimeout(m => {
            //         that.bindDevice()
            //     }, 300)
            // }
        )
    },
    //获取商户状态
    accountStatus() {
        let that = this
        let merchantId = this.data.merchantId || ''
        app.api.accountStatus({
            params: {
                merchantId
            },
            success(res) {
                let payload = res.payload || {}
                let status = payload.status // 是否可以进行提额的标识，由获取商户信息接口返回
                console.info(status)
                if (status == 'TRUE') {
                    wx.reLaunch({
                        url: '/package-a/creditcard-authentication/creditcard-authentication?merchantId=' + merchantId
                    })
                } else {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    })
                }
            }
        })
    },
    submit() {
        setTimeout(m => {
            if (this.data.tusn == '') {
                util.showToast('请输入终端TUSN')
                return false
            }
            this.deviceCheck()
        }, 100)

    },
    bindDevice() {
        let that = this
        // 由于这个接口相应比较慢，所有请求过程中禁止用户编辑输入框
        this.setData({
            editable: false
        })
        app.api.deviceBind({
            params: {
                sn: this.data.tusn,
                merchantId: this.data.merchantId
            },
            success(res) {
                wx.showModal({
                    title: '提示',
                    content: '绑定成功！',
                    showCancel: false,
                    success(res) {
                        setTimeout(() => {
                            that.gotoNextPage()
                        }, 500)

                    }
                })
            },
            complete() {
                that.setData({
                    editable: true
                })

            }
        })
    },
    gotoNextPage() {
        if (this.data.sourcePage == 'bindterminal') {
            wx.navigateBack()
        } else {
            this.accountStatus()
        }
    },
    skip() {
        wx.reLaunch({
            url: "/pages/index/index"
        })
        return
        // let that = this
        // wx.showModal({
        //     title: '提示',
        //     content: '跳过信用卡认证，交易额度较低!',
        //     success: function (res) {
        //         if (res.confirm) {
        //             wx.reLaunch({
        //                 url: "/pages/index/index"
        //             })
        //         }
        //     }
        // })
    },
})