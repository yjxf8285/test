/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-16 12:04:53
 * @LastEditTime: 2020-04-15 10:07:07
 */

const app = getApp()
import util from '../../utils/util'
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        cardData: {
            type: Object,
            value: null
        },
        singleMode: {
            type: Boolean,
            value: false
        }
    },
    data: {
        showMccSelect: true,
        canSave: false,
        merchantName: '',
        mccGroup: 101,
        region: '',
        occurTime: '',
        amount: '',
        typeStr: '消费支出',
        type: 'REGULAR',
        amountNumber: '0.00',
        regionName: '',
        startDate: '',
        endData: ''
    },
    ready() {

        let curDate = util.getNowDate()
        this.setData({
            occurTime: curDate,
            endData: curDate
        })
    },
    methods: {
        onTabClick() {
            this.triggerEvent('onTabClick', 1)
        },
        onRegionSelect({ detail }) {
            this.setData({
                region: detail.cityId
            })
            this.checkCanSave()
        },
        onTypeSelect({ detail }) {
            let val = Number(detail.value)
            let typeStr = ''
            let type = ''
            switch (val) {
                case 0:
                    typeStr = '消费支出'
                    type = 'REGULAR'
                    break
                case 1:
                    typeStr = '收入'
                    type = 'CUSTOM_REFUND'
                    break

            }

            this.setData({
                type,
                typeStr
            })
            this.checkCanSave()
        },
        bindDateChange: function (e) {
            this.setData({
                occurTime: e.detail.value
            })
            this.checkCanSave()
        },

        onSelcetMcc({ detail }) {
            let mccList = wx.getStorageSync('mccList')
            let mccObj = app.getMccId(detail)
            this.setData({
                mccGroup: detail,
                mccId: mccObj.id
            })
            this.checkCanSave()
        },
        bindiMerchantNameInput(e) {
            let val = e.detail.value
            this.setData({
                merchantName: val
            })
        },
        // 检查当前表单是否可以保存
        checkCanSave() {
            let merchantName = this.data.merchantName,
                mccGroup = this.data.mccGroup,
                region = this.data.region,
                occurTime = this.data.occurTime,
                amount = this.data.amount,
                type = this.data.type
            if (type == 'CUSTOM_REFUND') {
                mccGroup = '-9999'
                this.setData({
                    showMccSelect: false,
                })
            } else {
                this.setData({
                    showMccSelect: true,
                })
            }

            if (amount) {
                let errText = '消费支出金额，不允许超过卡片可用'
                switch (type) {
                    case 'REGULAR':
                        errText = '消费支出金额，不允许超过卡片可用'
                        if (Number(this.data.amount) > Number(this.data.cardData.availableLimit)) {
                            util.showToast(errText)
                            this.setData({
                                canSave: false
                            })
                            return
                        }
                        break
                    case 'CUSTOM_REFUND':
                        errText = '收入金额，不允许超过卡片负债'
                        if (Number(this.data.amount) > Number(this.data.cardData.debt)) {
                            util.showToast(errText)
                            this.setData({
                                canSave: false
                            })
                            return
                        }
                        break

                }
            }

            if (
                // merchantName && //备注
                mccGroup &&  // 商圈分类
                // region && // 地区
                occurTime &&  //日期
                type &&  // 记账类型
                amount // 金额
            ) {
                this.setData({
                    canSave: true
                })
            } else {
                this.setData({
                    canSave: false
                })
            }
        },
        bindAmountInput() {
            this.selectComponent("#keypad").show()
        },
        hideKeyPad() {
            this.selectComponent("#keypad").hide()
        },
        keypadSubmit({ detail }) {
            if (detail > 0) {
                this.setData({
                    amount: detail,
                    amountNumber: util.toNumbers(detail)
                })
                this.checkCanSave()
            } else {
                util.showToast('请输入有效金额')
                this.setData({
                    canSave: false
                })
            }

        },
        save() {
            let cardNo = this.data.cardData.cardNo
            let merchantName = this.data.merchantName
            let mccGroup = this.data.mccGroup
            let region = this.data.region
            let occurTime = this.data.occurTime
            let amount = this.data.amount
            let type = this.data.type
            // let backParams = Object.assign({}, this.data.params, {
            //     mcc: this.data.mccId,
            //     region: region,
            //     vendorName: merchantName,
            // })
            // let item = JSON.stringify(backParams)
            // util.setNavigateBackWithData();
            if (!this.data.canSave) return

            app.api.createTransaction({
                data: {
                    cardNo,
                    merchantName,
                    mccGroup,
                    region,
                    occurTime,
                    amount,
                    type, // 交易类型 REGULAR, VOID 消费支出 收入
                },
                success(res) {
                    // 显示确认框
                    wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 1000
                    })
                    // 切换前先标识一下是从手账过来的，成功后记得重置一下变量为false
                    app.globalData.fromCardAccM = true
                    wx.navigateTo({
                        url: "/package-a/data-statistics/data-statistics"
                    })
                }
            })
        }
    }
})