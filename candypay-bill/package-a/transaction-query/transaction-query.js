/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2020-04-28 12:14:56
 */
const app = getApp()
const util = require('../../utils/util.js')

Page({
    data: {
        pickerDataFields: 'day', // day or month
        page: 0,
        localDateStr: '',
        localDate: '',
        deviceTransactionlist: [],
        // currentDevice: {
        //     label: '全部',
        //     terminalId: ''
        // },
        currentMerchant: {
            label: '',
            merchantId: ''
        },
        cardNoOrreferencdNo: '',
        merchantList: [],
        startData: '',
        endData: ''
    },
    onLoad: function (opt) {

        this.getMerchantList()
        this.setLocalDate()
    },

    noInput({ detail }) {
        this.setData({
            cardNoOrreferencdNo: detail.value,
        })
    },
    search() {
        this.getPosorderMonth()
    },
    setLocalDate(value = '') {
        let nowDate = util.getNowDate()
        let startData = util.getCountedTime({ m: -3 })
        let endData = nowDate
        let pickerDataFields = this.data.pickerDataFields
        if (pickerDataFields == 'day') {
            if (!value) value = util.getNowDate()
        }
        if (pickerDataFields == 'month') {
            if (!value) value = util.getMonth(0, 1)
        }
        this.setData({
            deviceTransactionlist: [], //每次筛选要清空列表
            localDateStr: value,
            localDate: value,
            // localDateStr: value.replace(/-/g, '.'),
            // localDate: value.replace(/-/g, ''),
            startData,
            endData,
        })
    },
    getMerchantList() {
        app.api.getMerchantList({
            params: {
                idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
                requestType: 'TRANSICATION'
            },
            success: res => {
                let payload = res.payload || {}
                let accountInfos = payload.accountInfos || []
                accountInfos.forEach(item => {
                    item.label = util.interceptStr(item.merchantName, 20)
                });
                if (accountInfos.length > 0) {
                    this.setData({
                        page: 0,
                        merchantList: [...accountInfos],
                        currentMerchant: {
                            // label: '第三方第三方胜多负少的发送到收到反倒是放多少',
                            label: accountInfos[0].label || '',
                            merchantId: accountInfos[0].merchantId
                        },
                    })
                    this.getPosorderMonth()
                }
            }
        })
    },
    getPosorderMonth() {
        app.api.getPosorderDate({
            params: {
                localDate: this.data.localDate.replace(/\-/g, ''),
                customerNo: this.data.currentMerchant.merchantId,
                // yearMonth: '201911',
                // customerNo: '8610131840',
                // page: this.data.page,
                // size: 10
                page: 0,
                size: 100
            },
            success: res => {
                if (res.payload.length < 1) return
                let content = res.payload.content || []
                // content = [
                //     {
                //         "id": "192821695",
                //         "source": 'UPSTREAM',
                //         "type": 'REGULAR',
                //         occurTime:'1588047015118',
                //         "amount": 111,
                //         "commissions": 0,
                //         "cardNo": "6221637983189522",
                //         "cardName": null,
                //         "bankName": '招生银行',
                //         "vendorName": null,
                //         "vendorMcc": null,
                //         "vendorRegion": 0,
                //         "cardType": "CREDIT",
                //         "vendorMccCategoryName": null,
                //         "vendorRegionName": null,
                //         "daysAgo": "0",
                //         "bankCode": "64031000",
                //         "groupId": 0,
                //         "groupName": null,
                //         "styleType": "TRANS_STYLE_ZFB",
                //         "entryStatus": null,
                //         "transComments": null
                //     },
                // ]
                content.forEach(m => {
                    let sign = util.antiTransTranDeviceType(m.type).sign
                    m.amountColor = util.antiTransTranDeviceType(m.type).color
                    m.typeName = util.transTranDeviceType(m.type).name
                    m.hidecardNo = util.cutFourCardNumber(m.cardNo)
                    // m.hidecardNo = util.hideCardNumber(m.cardNo)
                    m.mccCategoryName = app.getMccCategoryName(m.vendorMcc)
                    m.mccGroupName = app.getMccGroupName(m.vendorMcc)
                    m.amountStr = sign + util.toNumbers(Math.abs(m.amount)) // 是正是负单独处理
                    m.occurTime = util.timestampToTime(m.occurTime)
                    if (m.styleType == 'TRANS_STYLE_YL' || m.styleType == 'TRANS_STYLE_YSFMM') {
                        m.bankImg = 'icon_yinlian_pay'
                    } else {
                        m.bankImg = util.getBankLogo(m.groupId)
                    }
                    m.sourceStr = m.source == 'UPSTREAM' ? 'POS' : '手账'


                    m.bankImg = m.iconName || 'TY'
                    m.titleStr = m.sourceStr + m.typeName + '(' + m.bankName + m.hidecardNo + ')'
                    m.listType = 1
                    m.commissionsStr = '-' + util.toNumbers(Math.abs(m.commissions))
                    // TRANS_STYLE_YL, TRANS_STYLE_WX, TRANS_STYLE_ZFB
                    if (m.styleType == 'TRANS_STYLE_YL') {
                        m.bankImg = 'YL'
                        m.titleStr = '银联二维码'
                    }
                    if (m.styleType == 'TRANS_STYLE_WX') {
                        m.bankImg = 'WX'
                        m.titleStr = '微信'
                    }
                    if (m.styleType == 'TRANS_STYLE_ZFB') {
                        m.bankImg = 'ZFB'
                        m.titleStr = '支付宝'
                    }
                })
                let forMatContent = this.formatList(content) // 拆出来手续费
                forMatContent = content //不拆了
                this.setData({
                    deviceTransactionlist: [...this.data.deviceTransactionlist, ...forMatContent]
                })
            }
        })
    },
    imgErr(e) {
        let deviceTransactionlist = this.data.deviceTransactionlist
        let item = e.currentTarget.dataset.item || {}
        deviceTransactionlist.forEach(m => {
            if (m.id == item.id) {
                m.bankImg = 'TY'
            }
        })
        this.setData({ deviceTransactionlist })

    },
    // 把列表拆分出来为手续费单独一条记录
    formatList(originList = []) {
        let newList = []
        let newM = {}
        originList.forEach(m => {
            newList.push(m)
            newM = Object.assign({}, m, {
                listType: 2,
                vendorName: '手续费',
                typeStr: '费用',
                amountColor: '#41a206',
                amountStr: '-' + util.toNumbers(Math.abs(m.commissions)),
            })
            newList.push(newM)
        })

        return newList
    },
    selectDevice({ detail }) {
        let merchantList = this.data.merchantList
        let currentMerchant = merchantList[detail.value]
        this.setData({
            page: 0,
            deviceTransactionlist: [], //每次筛选要清空列表
            currentMerchant
        })
        this.getPosorderMonth()
    },

    selectToday({ detail }) {
        this.setLocalDate(detail.value)
        this.getPosorderMonth()
    },

    onReachBottom() {
        // if (!this.loading) {
        //     this.setData({
        //         page: this.data.page + 1
        //     })
        //     this.getPosorderMonth()
        // }
    },
})