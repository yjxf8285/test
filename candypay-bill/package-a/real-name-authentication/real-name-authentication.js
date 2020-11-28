/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-24 14:36:35
 */
import mpUploadFile from "../../utils/mpUploadFile"
import util from '../../utils/util.js'
import validate from '../../utils/validate.js'
const app = getApp()
// 初始化签名变量，放在 Page 前
Page({
    data: {
        start: '',
        end: '',
        nowDate: '',
        picMaxSize: 2457600, //300k = 2457600bit
        frontPicPath: '',
        backPicPath: '',
        handPicPath: '',
        chineseName: '',
        idCardNo: '',
        startDateStr: '',
        endDateStr: ''
    },
    onLoad() {
        console.info('互联网用户？', app.globalData.isGuestUser)
        this.setDefDate()
    },
    setDefDate() {
        this.setData({
            start: util.getNowDate(1, -20),
            end: util.getNowDate(1, 20),
            nowDate: util.getNowDate()
        })
    },
    selectStartDate(e) {
        this.setData({
            startDateStr: e.detail.value
        })
    },
    selectEndDate(e) {
        this.setData({
            endDateStr: e.detail.value
        })
    },
    setAwaysValid() {
        this.setData({
            endDateStr: '长期有效'
        })
    },
    setChineseName(e) {
        let chineseName = this.data.chineseName
        if (validate.specialCharacter(e.detail.value)) {
            chineseName = e.detail.value
        }
        this.setData({
            chineseName
        })
    },
    setIdCardNo(e) {
        this.setData({
            idCardNo: e.detail.value.toUpperCase()
        })
    },
    checkInputRule() {
        if (this.data.frontPicPath == '') {
            util.showToast('请上传身份证正面照片!')
            return false
        }
        if (this.data.backPicPath == '') {
            util.showToast('请上传身份证反面照片!')
            return false
        }
        if (this.data.handPicPath == '') {
            util.showToast('请上传手持身份证照片!')
            return false
        }
        if (this.data.chineseName == '') {
            util.showToast('请输入姓名!')
            return false
        }
        if (!validate.checkChineseName(this.data.chineseName)) {
            util.showToast('姓名错误!')
            return false
        }
        if (this.data.idCardNo == '') {
            util.showToast('请输入身份证号!')
            return false
        }
        if (!validate.isIdCardNo(this.data.idCardNo)) {
            util.showToast('身份证号错误!')
            return false
        }
        let age = util.getAgeFromIdCard(this.data.idCardNo)
        console.info(age)
        if (age > 70 || age < 18) {
            util.showToast('请使用18至70岁公民身份证件!')
            return false
        }
       
        if (this.data.startDateStr == '') {
            util.showToast('请选择身份证有效期!')
            return false
        }
        if (this.data.endDateStr == '') {
            util.showToast('请选择身份证有效期!')
            return false
        }
        // if (this.data.startDateStr == '') {
        //     util.showToast('请输入起始时间!')
        //     return false
        // }
        // if (this.data.endDateStr == '') {
        //     util.showToast('请输入截止时间!')
        //     return false
        // }
        if (this.data.startDateStr == this.data.endDateStr) {
            util.showToast('身份证有效期有误')
            return false
        }
        return true
    },
    selectFrontPic() {
        this.choosePic('frontPicPath', 'IDCARD_CORRECT')
    },
    selectBackPic() {
        this.choosePic('backPicPath', 'IDCARD_OPPOSITE')
    },
    selectHandPic() {
        this.choosePic('handPicPath', 'IDCARD_HAND')
    },
    choosePic(picName, type) {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                let tempFilePaths = res.tempFilePaths
                let size = res.tempFiles[0].size
                if (size > that.data.picMaxSize) {
                    wx.showModal({
                        title: '错误',
                        content: '上传的图片大小不能超过300k',
                        showCancel: false
                    })
                } else {

                    that.uploadImg(picName, tempFilePaths[0], type)
                }

            }
        })
    },
    uploadImg: function (picName, filePath, type) {
        let that = this
        // IDCARD_CORRECT, //正面
        // IDCARD_OPPOSITE, //反面
        // IDCARD_HAND, //手持
        // MERCH_AGREE_SIGN; //签名
        mpUploadFile.upload({
            filePath,
            params: { type },
            // data: {
            //   abc: 1
            // },
            callback() {
                that.setData({
                    [picName]: filePath
                })
            }
        })
    },

    submit() {
        if (!this.checkInputRule()) {
            return
        }
        if (app.globalData.authType != 'AUTHED' && !app.globalData.isGuestUser) {
            wx.showModal({
                title: '提示',
                content: '此身份证将成为商户开户的唯一身份证',
                success: (res) => {
                    if (res.confirm) {
                        this.postAuthentication()
                    }
                }
            })
        } else {
            this.postAuthentication()
        }

    },
    postAuthentication() {
        let that = this
        let data = this.data
        let startDate = data.startDateStr.replace(/\-/g, '')
        let endDate = data.endDateStr.replace(/\-/g, '')
        if (data.endDateStr == '长期有效') {
            endDate = String(Number(startDate) + 1000000)
        }
        app.api.realNameAuthentication({
            data: {
                name: data.chineseName,
                idCard: data.idCardNo,
                startDate,
                endDate
            },
            success(res) {
                if (!res.payload) {
                    wx.showModal({
                        title: '提示',
                        content: '认证不通过！',
                        success: (res) => {

                        }
                    })
                }
                app.globalData.name = data.chineseName
                app.globalData.idCard = data.idCardNo
                app.globalData.authType = 'AUTHED'
                that.getMerchantList() // 认证后判断身份证下面是否有商户
            }
        })
    },
    getMerchantList() {
        let that = this
        let idCard = this.data.idCardNo || ''
        app.api.getMerchantList({
            params: {
                idCard, //如果认证过的商户就需要传身份证
                requestType: 'TRANSICATION'
            },
            success: res => {
                let data = res.payload || {}
                let accountInfos = data.accountInfos || []
                 // 如果是互联网用户就跳到新增商户页面，否则去商户列表
                if (accountInfos && accountInfos.length > 0) {
                    that.gotoMerchantList()
                } else {
                    that.gotoMerchantInfo()
                }
            }
        })
    },
    gotoMerchantInfo() {
        wx.reLaunch({
            url: '/package-a/complete-merchant-info/complete-merchant-info'
        })
    },
    gotoMerchantList() {
        wx.reLaunch({
            url: '/package-a/account-list/account-list'
        })
    }

})