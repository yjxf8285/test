/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-05-08 14:51:25
 */
const app = getApp()
import util from '../../utils/util.js'
import validate from '../../utils/validate.js'
import mpUploadFile from "../../utils/mpUploadFile"
Page({
    data: {
        name: '',
        mobile: '',
        idCard: '',
        startDate: '',
        endDate: '',
        mechantName: '',
        districtId: '',
        posUsedRegion: '',
        tusn: '',
        canSubmit: true, // 防止连续提交
        customerNo: '',// 添加商户成功之后接口返回的id
        fullName: '', //添加商户成功之后接口返回的商户名称
        createTime: ''// 添加商户成功之后接口返回的时间
    },
    onLoad: function () {
        this.setData({
            startDate: app.globalData.startDate,
            mobile: app.globalData.mobile,
            endDate: app.globalData.endDate,
            name: app.globalData.name,
            idCard: app.globalData.idCard,
        })
    },
    onReady: function () {

    },
    onShow: function () {
    },
    onDistrictSelect({ detail }) {
        this.setData({
            districtId: detail.districtId
        })
    },
    setMobile(e) {
        let mobile = e.detail.value
        this.setData({ mobile })
    },
    setMechantName(e) {
        let mechantName = this.data.mechantName
        if (validate.specialCharacter(e.detail.value)) {
            mechantName = e.detail.value
        }
        this.setData({ mechantName })
    },
    checkMechatnName(e) {
        let mechatnName = e.detail.value
        if (mechatnName.indexOf('有限公司') != -1) {
            wx.showModal({
                title: '提示',
                content: '名称不能包含“有限公司”',
                showCancel: false
            })
        }
    },
    setPosUsedRegion(e) {
        let posUsedRegion = this.data.posUsedRegion
        if (validate.specialCharacter(e.detail.value)) {
            posUsedRegion = e.detail.value
        }
        this.setData({ posUsedRegion })
    },
    setTusn(e) {
        let tusn = this.data.tusn
        if (validate.letterOrNumber(e.detail.value)) {
            tusn = e.detail.value
        }
        this.setData({ tusn })
    },
    checkTUSN(tusn, cb) {
        let res = {
            success: 1,
            message: '品牌次数超限，请联系代理商'
        }
        if (!res.success) {
            wx.showModal({
                title: '提示',
                content: res.message,
                showCancel: false
            })
        } else {
            cb && cb(res)
        }
    },
    scanCode() {
        let that = this
        util.scanBarCode(tusn => {
            that.setData({ tusn })
        })
    },
    clearCanvas() {
        this.selectComponent("#autograph").clearClick()
    },
    saveAutograph() {
        let that = this
        this.setData({
            canSubmit: false
        })
        this.selectComponent("#autograph").saveClick(function (tempFilePath) {
            that.creatMerchant(tempFilePath)

        })
    },
    uploadAutograph(filePath, customerNo = '') {
        // save autograph picture
        // wx.saveImageToPhotosAlbum({
        //     filePath,
        //     success(res) { }
        // })
        let that = this
        mpUploadFile.upload({
            filePath,
            params: {
                customerNo,
                type: 'MERCH_AGREE_SIGN'
            },
            callback() {
                that.gotoNextPage()
            }
        })
    },
    checkInputRule() {
        if (!validate.isPhoneAvailable(this.data.mobile)) {
            util.showToast('请输入正确的手机号码')
            return;
        }
        if (this.data.mechantName == '') {
            util.showToast('请输入商户名称!')
            return false
        }
        if (this.data.mechantName.length < 6) {
            util.showToast('商户名称最小6位!')
            return false
        }
        if (this.data.mechantName.indexOf('有限公司') != -1) {
            util.showToast('名称不能包含“有限公司!')
            return false
        }
        if (this.data.districtId == '') {
            util.showToast('请选择归属地!')
            return false
        }
        if (this.data.posUsedRegion == '') {
            util.showToast('请输入POS使用地!')
            return false
        }
        if (!validate.chineseCharacter(this.data.posUsedRegion)) {
            util.showToast('POS使用地有误!')
            return false
        }
        return true
    },
    creatMerchant(tempFilePath) {
        let that = this
        let data = this.data
        app.api.creatMerchant({
            data: {
                customerNo: this.data.customerNo,
                phone: data.mobile,
                legalPerson: data.name,
                identityNo: data.idCard,
                fullName: data.mechantName,
                cpOrgCode: data.districtId,
                receiveAddress: data.posUsedRegion,
                posSn: data.tusn,
                beginValidityTerm: data.startDate,
                endValidityTerm: data.endDate
            },
            success(res) {
                // if (!res.payload) {
                //     wx.showModal({
                //         title: '提示',
                //         content: '添加失败！',
                //         success: (res) => {

                //         }
                //     })
                // }
                let payload = res.payload || {}
                let code = payload.code || ''
                let msg = payload.msg || ''
                console.info(payload)
                that.setData({
                    customerNo: payload.customerNo,
                    fullName: payload.fullName,
                    createTime: payload.createTime,
                })
                // 响应code 00 成功 01 失败 02页面弹出返回的msg，继续下一个页面
                if (code == '02') {
                    wx.showModal({
                        title: '提示',
                        content: msg,
                        success: (res) => {
                            if (res.confirm) {
                                that.uploadAutograph(tempFilePath, payload.customerNo)
                            }
                        }
                    })
                } else {
                    that.uploadAutograph(tempFilePath, payload.customerNo)
                }
            }
        })
    },
    gotoNextPage() {
        let item = this.data || {}
        let params = encodeURIComponent(JSON.stringify(item))
        wx.navigateTo({
            url: '/package-a/add-settlement-card/add-settlement-card?params=' + params
        })
    },
    gotoOpenAgreement() {
        let data = this.data
        let params = encodeURIComponent(JSON.stringify(data))
        wx.navigateTo({
            url: '/package-a/account-opening-agreement/account-opening-agreement?params=' + params
        })
    },
    submit() {
        if (this.data.canSubmit) {
            if (!this.checkInputRule()) return
            this.saveAutograph()
            // 防止小程序页面跳转的期间还能触发按钮点击提交
            setTimeout(() => {
                this.setData({
                    canSubmit: true
                })
            }, 2000);
        }
    }
})