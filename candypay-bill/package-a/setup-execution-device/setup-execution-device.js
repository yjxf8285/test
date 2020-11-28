/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-07-01 10:37:16
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2019-07-11 18:02:45
 */
const app = getApp()
const util = require('../../utils/util')
Page({
    data: {
        executable: false,
        posArray: [],
        curPos: {
            label: '全部',
            sn: 'ALL'
        },
        planDetails: [],
        planName: '',
        planId: ''
    },
    onLoad(opt) {
        let planId = opt.planId || ''
        this.setData({
            planId
        })
    },
    onReady() {
        this.getPlan()
        this.getPost()
    },
    getPost() {
        app.api.getDevice({
            success: r => {
                let posArray = r.payload || []
                posArray.forEach(element => {
                    element.label = element.label || '设备名'
                });
                if (posArray.length == 0) {
                    this.setData({
                        executable: false,
                        curPos: {
                            label: '您还没有绑定终端',
                            sn: 'ALL'
                        },
                        posArray: [{
                            label: '您还没有绑定终端',
                            sn: 'ALL'
                        }]
                    })
                } else {
                    this.setData({
                        executable: true,
                        posArray: [
                            {
                                label: '全部',
                                sn: 'ALL'
                            }, ...posArray
                        ]
                    })
                }

            }
        })
    },
    getPlan() {
        app.api.getPlan({
            params: {
                id: this.data.planId
            },
            success: r => {
                let payload = r.payload[0] || []
                let planDetails = payload.planDetails || []
                planDetails.forEach(element => {
                    element.startTimeStr = util.formatTime(element.startTime)
                    element.endTimeStr = util.formatTime(element.endTime)
                    let sh = Number(element.startTimeStr.split(':')[0])
                    let sm = element.startTimeStr.split(':')[1]
                    let eh = Number(element.endTimeStr.split(':')[0])
                    let em = element.startTimeStr.split(':')[1]
                    element.startTimeSubScript = [sh, sm == '00' ? 0 : 1]
                    element.endTimeSubScript = [eh, em == '00' ? 0 : 1]
                });
                this.setData({
                    planId: payload.id || '',
                    planName: payload.name || '',
                    planDetails
                })
            }
        }, res => {
            if (res.data.payload) {
                wx.showModal({
                    title: '提示',
                    content: res.data.payload,
                    showCancel: false,
                    success() {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '网络请求失败',
                    showCancel: false,
                    success() {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            }
        })
    },
    pickerPosChange(e) {
        let index = e.detail.value
        let posArray = this.data.posArray
        let curPos = posArray[index]
        this.setData({
            curPos
        })
    },
    execute() {
        let data = this.data
        app.api.postDevicePlan({
            params: {
                sn: data.curPos.sn
            },
            data: {
                id: data.planId,
                name: data.planName
            },
            success: r => {
                let payload = r.payload || false
                if (payload) {
                    wx.showModal({
                        title: '提示',
                        content: '开始执行！',
                        showCancel: false,
                        success() {
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    })
                }
            }
        })
    }
})