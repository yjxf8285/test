/*
 * @Author: Richard
 * @Date: 2018-11-28 17:35:12
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-10 10:58:30
 *  
 */
const util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        noscroll: false,
        showDrawer: false,
        // 设备相关
        label: '',
        sn: '',
        merchantName: '',
        merchantMcc: '',
        merchantRegion: '',
        merchantRegionCode: '',
        // 卡相关
        cardNo: '',
        cardDisplayNo: '',
        bankName: '',
        cardName: '',
        // 公用
        canSave: false,
        tabIndex: 0,
        tapIndexName: 'default',
        entryMode: 1,//入口类型：1=设备 2=卡
        params: {},
        vendorMcc: '',
        vendorName: '',
        vendorRegion: '',
        vendorType: '',
        modalShow: false,
        chooseAccounting: {
            MerchantName: '',
            MerchantLoaction: '',
            MerchantCategoryName: '',
            MerchantGroupName: '',
        },
        chooseData: {},
    },
    // 阻止用户滑动选项卡
    onTouchMove() {
        return
    },
    // 行业筛选按钮被点击
    onclickfilterbtn() {
        this.selectComponent("#c-mcc-filter").openDrawer()
    },
    // mcc筛选后触发
    onmccfilterselected({ detail }) {
        this.selectComponent("#c-category-menu").onFilter(detail)
    },
    // 刷新商户列表
    refreshVendorList(pramas) {
        this.selectComponent("#c-category-menu").onFilter(pramas)
    },
    onLoad(options) {
        let that = this
        let params = {}
        let p = decodeURIComponent(options.params || '')
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
        let tabIndex = 0
        let tapIndexName = 'default'
        let canSave = false
        switch (params.vendorType) {
            case 'DEFAULT':
                canSave = true
                tabIndex = 0
                tapIndexName = 'default'
                break;
            case 'SPECIFIED':
                canSave = false
                tapIndexName = 'speed'
                tabIndex = 1
                break;
            case 'group':
                tabIndex = 2
                break;
        }

        this.setData({
            canSave,
            tabIndex,
            tapIndexName,
            label: params.label || '',
            sn: params.sn || '',
            merchantName: params.merchantName || '',
            merchantMcc: app.getMccName(params.merchantMcc) || '',
            merchantRegion: app.getRegionName(params.merchantRegion, true) || '',
              // merchantRegionCode: params.vendorRegion || params.merchantRegion || '',
            merchantRegionCode: params.merchantRegion || '',
            vendorMcc: app.getMccName(params.vendorMcc || params.merchantMcc) || '',
            vendorName: params.vendorName || params.merchantName || '',
            vendorRegion: app.getRegionName(params.vendorRegion || params.merchantRegion, true) || '',
            vendorType: util.getVendorTypeName(params.vendorType) || '',
            cardDisplayNo: params.cardDisplayNo || '',
            cardNo: params.cardNo || '',
            bankName: params.bankName || '',
            cardName: params.name || '',
            entryMode: params.entryMode || 1,
            params: params,

        })
    },
    onShow() { },
    tabBtnTap(e) {
        let that = this
        let i = Number(e.currentTarget.dataset.index)
        let tapIndexName = 'default'
        let canSave = true
        switch (i) {
            case 0:
                canSave = true
                tapIndexName = 'default'
                break;
            case 1:
                canSave = false
                tapIndexName = 'speed'
                that.refreshVendorList({
                    category: {
                        id: '',
                        name: '全部'
                    },
                    group: [{
                        id: '',
                        name: '全部'
                    }]
                })
                break;
        }
        this.setData({
            canSave,
            tabIndex: i,
            tapIndexName
        })
    },
    // swiperChange({ detail }) {
    //     this.setData({
    //         tabIndex: detail.current
    //     })
    // },
    onfinalSelcet({ detail }) {
        let chooseData = {
            id: detail.id,
            name: detail.name,
            terminalId: detail.terminalId,
            mcc: detail.mcc,
            region: detail.region,
            vendorName: detail.name, //绑定商户
            vendorId: detail.id //绑定商户ID
        }
        this.setData({
            canSave: true,
            chooseData
        })
    },
    modalCancel() {
        this.setData({
            noscroll: false,
            modalShow: false
        })
        util.setNavigateBackWithData();
    },
    showModalWindow() {
        let that = this
        let sn = this.data.sn
        let cardNo = this.data.cardNo
        let chooseData = this.data.chooseData
        let tabIndex = this.data.tabIndex
        let chooseAccounting = {
            MerchantName: chooseData.name,
            MerchantLoaction: app.getRegionName(chooseData.region, true),
            MerchantMccName: app.getMccName(chooseData.mcc),
        }
        let data = {
            id: chooseData.id,
            mcc: chooseData.mcc,
            name: chooseData.name,
            region: chooseData.region,
            terminalId: chooseData.terminalId
        }
        this.setData({
            noscroll: true,
            modalShow: true,
            modalTitle: this.data.title || '',
            chooseAccounting: chooseAccounting,
            setAccountRequesting: true,
            requestGoMinTime: false
        })
        if (tabIndex == 0) { // 如果是默认就不调设置商户的接口
            setTimeout(m => {
                that.setData({
                    setAccountRequesting: false
                })
            }, 300)
            return
        }

        switch (this.data.entryMode) {
            case 1: // 设备
                app.api.setDeviceVendor({
                    params: {
                        sn
                    },
                    data,
                    success() {
                        setTimeout(m => {
                            that.setData({
                                setAccountRequesting: false
                            })
                        }, 300)
                    }
                })
                break;
            case 2: // 卡
                app.api.setCardVendor({
                    params: {
                        cardNo
                    },
                    data,
                    success() {
                        setTimeout(m => {
                            that.setData({
                                setAccountRequesting: false
                            })
                        }, 300)
                    }
                })
                break;
        }

    },
    save() {
        let that = this
        let sn = this.data.sn
        let cardNo = this.data.cardNo
        let tabIndex = this.data.tabIndex
        let type = tabIndex == 0 ? 'DEFAULT' : 'SPECIFIED'
        if (!this.data.canSave) return
        switch (this.data.entryMode) {
            case 1: // 设备
                app.api.setDeviceVendorType({
                    params: {
                        sn,
                        type
                    },
                    success() {
                        that.showModalWindow()
                    }
                })
                break;
            case 2: // 卡
                app.api.setCardVendorType({
                    params: {
                        cardNo,
                        type
                    },
                    success() {
                        that.showModalWindow()
                    }
                })
                break;
        }
    }
})