/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2020-03-30 14:12:25
 */
const app = getApp()
const util = require('../../utils/util.js')


Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        pickerDataFields: 'day', // day or month
        page: 0,
        localDateStr: '',
        localDate: '',
        deviceTransactionlist: [],
        currentDevice: {
            label: '全部',
            terminalId: ''
        },
        cardNoOrreferencdNo: '',
        deviceList: [],
        endData: ''
    },

    ready() {
        let curDate = util.getNowDate()

        this.setData({
            endData: curDate
        })
        this.getDevice()
        this.setLocalDate()
    },

    methods: {
        columnchange() {
        },
        noInput({ detail }) {
            this.setData({
                cardNoOrreferencdNo: detail.value,
            })
        },
        search() {
            this.getTransactionDevice()
        },
        setLocalDate(value = '') {
            let pickerDataFields = this.data.pickerDataFields
            if (pickerDataFields == 'day') {
                if (!value) value = util.getNowDate()
            }
            if (pickerDataFields == 'month') {
                if (!value) value = util.getMonth(0, 1)
            }
            this.setData({
                deviceTransactionlist: [], //每次筛选要清空列表
                localDateStr: value.replace(/-/g, '.'),
                localDate: value.replace(/-/g, ''),
            })
        },
        getDevice() {
            app.api.getDevice({
                params: {
                    sn: this.data.sn
                },
                success: res => {
                    res.payload.forEach(element => {
                        element.label = element.label || '设备名'
                    });
                    this.setData({
                        page: 0,
                        deviceList: [{
                            label: '全部',
                            terminalId: ''
                        }, ...res.payload]
                    })
                    this.getTransactionDevice()
                }
            })
        },
        getTransactionDevice() {
            app.api.getTransactionDevice({
                params: {
                    // localDate: 20190318,
                    // terminalId: 90212115,
                    localDate: this.data.localDate,
                    terminalId: this.data.currentDevice.terminalId,
                    cardNoOrreferencdNo: this.data.cardNoOrreferencdNo,
                    page: this.data.page,
                    size: 10
                },
                success: res => {
                    if (res.payload.length < 1) return
                    let content = res.payload.content || []
                    // content = [
                    //     {
                    //         amount: -1000,
                    //         bankCode: "63030000",
                    //         bankName: "中国光大银行",
                    //         cardName: "炎黄卡金卡",
                    //         cardNo: "6226580065011674",
                    //         cardType: "CREDIT",
                    //         commissions: 5.5,
                    //         daysAgo: "0",
                    //         entryStatus: "ENTRY_VOID",
                    //         groupId: 413,
                    //         groupName: "中国光大银行银联",
                    //         id: "310246716",
                    //         occurTime: 1585276558768,
                    //         source: "UPSTREAM",
                    //         styleType: "TRANS_STYLE_YHK", //交易方式：免密，云闪付，云闪付免密，银联，微信，支付宝，银行卡：TRANS_SYTLE_MM, TRANS_SYTLE_YSF, TRANS_STYLE_YSFMM, TRANS_STYLE_YL, TRANS_STYLE_WX, TRANS_STYLE_ZFB, TRANS_STYLE_YHK
                    //         transComments: null,
                    //         type: "REGULAR",
                    //         vendorMcc: 5331,
                    //         vendorMccCategoryName: "食品零售",
                    //         vendorName: "连光伯DIANPAY小微18444333384",
                    //         vendorRegion: 1301,
                    //         vendorRegionName: "石家庄市"
                    //     }
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

                        m.sourceStr = m.source == 'UPSTREAM' ? 'POS' : '手账'
                        // m.typeStr = m.sourceStr + '-' + m.typeName
                        m.typeStr = m.sourceStr + m.typeName
                        m.listType = 1
                        m.commissionsStr = '-' + util.toNumbers(Math.abs(m.commissions))
                        if (
                            m.styleType == 'TRANS_SYTLE_MM' ||
                            m.styleType == 'YSF' ||
                            m.styleType == 'TRANS_SYTLE_YSF' ||
                            m.styleType == 'TRANS_STYLE_YSFMM' ||
                            m.styleType == 'TRANS_STYLE_YHK'
                        ) {
                            m.bankImg = util.getBankLogo(m.groupId)
                            m.nameStr = m.typeStr + '(' + m.bankName + m.hidecardNo + ')'
                        } else {
                            m.bankImg = util.styleTypeObj(m.styleType).iconName
                            m.nameStr = util.styleTypeObj(m.styleType).name
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
            let deviceList = this.data.deviceList
            let currentDevice = deviceList[detail.value]
            this.setData({
                page: 0,
                deviceTransactionlist: [], //每次筛选要清空列表
                currentDevice
            })
            this.getTransactionDevice()
        },

        selectToday({ detail }) {
            this.setLocalDate(detail.value)
            this.getTransactionDevice()
        },
        onscrollbottom() {
            this.setData({
                page: this.data.page + 1
            })
            this.getTransactionDevice()
        }
    }
})