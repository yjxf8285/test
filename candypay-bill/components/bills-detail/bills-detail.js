/* 
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2020-04-19 10:41:03
 */
const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        page: 0,
        localDateStr: '',
        localDate: '',
        deviceTransactionlist: [],
        currentCard: {
            name: '全部卡片',
            hidecardNo: '全部卡片',
            cardNo: '全部卡片'
        },
        cardList: [],
        endData: ''
    },
    ready() {
        this.init()
    },

    methods: {
        init() {
            let curDate = util.getNowDate()
            this.setData({
                page: 0,
                localDateStr: '',
                localDate: '',
                deviceTransactionlist: [],
                currentCard: {
                    name: '全部卡片',
                    hidecardNo: '全部卡片',
                    cardNo: '全部卡片'
                },
                cardList: [],
                endData: ''
            })
            this.setLocalDate()
            this.getCardListSearch()
            this.getTransaction()
        },
        noInput({ detail }) {
            this.setData({
                currentCard: {
                    name: '全部卡片',
                    hidecardNo: '全部卡片',
                    cardNo: detail.value
                },
            })
        },
        search() {
            this.getTransaction()
        },
        getCardListSearch() {
            app.api.getCardListSearch({
                success: res => {
                    let cardList = res.payload || []
                    cardList.forEach(m => {
                        m.hidecardNo = util.hideCardNumber(m.cardNo)
                    })

                    this.setData({
                        cardList: [{
                            name: '全部卡片',
                            hidecardNo: '全部卡片',
                            cardNo: ''
                        },
                        ...cardList]
                    })
                }
            })
        },
        setLocalDate(value = '') {
            if (!value) value = util.getNowDate()
            this.setData({
                deviceTransactionlist: [], //每次筛选要清空列表
                localDateStr: value.replace(/-/g, '.'),
                localDate: value.replace(/-/g, ''),
            })
        },

        getTransaction() {
            let cardNo = this.data.currentCard.cardNo
            if (cardNo == '全部卡片') {
                cardNo = ''
            }
            app.api.getTransaction({
                params: {
                    // localDate: '20190318',
                    localDate: this.data.localDate,
                    cardNoOrreferencdNo: cardNo,
                    page: this.data.page,
                    size: 10
                },
                success: res => {
                    if (res.payload.length < 1) return
                    let content = res.payload.content
                    content.forEach(m => {
                        let sign = util.transTranDeviceType(m.type).sign // 正负号
                        m.typeName = util.transTranDeviceType(m.type).name
                        m.hidecardNo = util.hideCardNumber(m.cardNo)
                        m.mccCategoryName = app.getMccCategoryName(m.vendorMcc)
                        m.mccGroupName = app.getMccGroupName(m.vendorMcc)
                        m.amountStr = sign + util.toNumbers(Math.abs(m.amount))
                        if (m.source == 'UPSTREAM') { // 手账隐藏时分秒
                            m.occurTime = util.timestampToTime(m.occurTime)
                        } else {
                            m.occurTime = util.timestampToTime(m.occurTime, 2)
                        }
                        // m.bankImg = util.getBankLogo(m.groupId)
                        m.bankImg = m.iconName || 'TY'
                        m.sourceStr = m.source == 'UPSTREAM' ? 'POS' : '手账'
                        // m.typeStr = m.sourceStr + '-' + m.typeName
                        m.typeStr = (sign == '-') ? '消费支出' : '收入'
                        m.listType = 1
                        m.amountColor = util.transTranDeviceType(m.type).color

                        if (m.type == 'REPAYMENT') {
                            m.vendorName = m.transComments
                        }
                    })
                    let forMatContent = content
                    // let forMatContent = this.formatList(content) // 拆出来手续费
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
            originList.forEach(m => {
                newList.push(m)
                let newM = Object.assign({}, m, {
                    listType: 2,
                    vendorName: '手续费',
                    typeStr: '费用',
                    amountStr: util.transTranDeviceType(m.type).sign + util.toNumbers(Math.abs(m.commissions)),
                })
                newList.push(newM)
            })
            return newList
        },
        selectCard({ detail }) {
            let cardList = this.data.cardList
            let currentCard = cardList[detail.value]
            this.setData({
                page: 0,
                deviceTransactionlist: [], //每次筛选要清空列表
                currentCard
            })
            this.getTransaction()
        },

        selectToday({ detail }) {
            this.setLocalDate(detail.value)
            this.getTransaction()
        },
        onscrollbottom() {
            this.setData({
                page: this.data.page + 1
            })
            this.getTransaction()
        }
    }
})