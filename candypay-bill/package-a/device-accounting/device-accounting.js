/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-06 14:17:31
 * @LastEditTime: 2019-05-16 19:41:31
 */
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        // 页面控制
        canSave: false,
        tabIndex: 0, // 0是默认 1是速记
        entryMode: 1, // 1代表设备；2代表卡片；3代表圈子
        // 设备信息
        label: '',
        sn: '',
        hideSn: '',
        merchantName: '',
        merchantMcc: '',
        merchantRegion: '',
        merchantRegionCode: '',
        deviceData: {}, // 进来的设备数据
        // 已选的商户
        chooseData: {},
    },
    onLoad(opt) {
       
        let that = this
        let p = decodeURIComponent(opt.params || '')
        // p = '{"sn":"1985653124","label":"啊的吧发发 f多大的的","merchantRegion":1201,"vendorType":"DEFAULT","vendorName":"市友艳水产经营部","vendorRegion":1201,"vendorMcc":5422,"terminalId":"90271714","merchantName":"自动化测试商户15830797996有限公司","merchantMcc":5331,"merchantId":"86101001078","merchantRegionName":"天津市","merchantMccCategoryName":"食品零售","merchantMccGroupName":"杂货便利店","hideSn":"1985 **** **** 3124","vendorRegionName":"天津市","vendorMccCategoryName":"食品零售","vendorMccGroupName":"冷藏肉类"}'
        let params = JSON.parse(p || '{}')
        let tabIndex = 0
        switch (params.vendorType) {
            case 'DEFAULT':
                tabIndex = 0
                break;
            case 'SPECIFIED':
                tabIndex = 1
                break;
            case 'group':
                tabIndex = 2
                break;
        }
        this.setData({
            deviceData: params,
            tabIndex,
            sn: params.sn || '',
            hideSn: util.hideSnNumber(params.sn || ''),
            label: params.label || '',
            merchantName: params.merchantName || '',
            merchantMcc: app.getMccName(params.merchantMcc) || '',
            merchantRegion: app.getRegionName(params.merchantRegion, true) || '',
            vendorMcc: app.getMccName(params.vendorMcc || params.merchantMcc) || '',
            vendorName: params.vendorName || params.merchantName || '',
            vendorRegion: app.getRegionName(params.vendorRegion || ''),
            merchantRegionCode: params.merchantRegion || '',
        })

    },
    onReady() {
        this.confirmBox = this.selectComponent('#confirm-box')
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
    // 得到商户列表之后
    onGetVendor({ detail }) {

        this.setData({
            canSave: false,
        })
    },
    // 选完商户
    onfinalSelcet({ detail }) {
        let tabIndex = detail.default ? 0 : 1 // 有默认就是设备，没有就是卡片
        let chooseData = {
            id: detail.id,
            name: detail.name,
            terminalId: detail.terminalId,
            mcc: detail.mcc,
            region: detail.region,
            vendorName: detail.name, //绑定商户
            vendorId: detail.id, //绑定商户ID
            transFlg: detail.transFlg
        }
        this.setData({
            canSave: true,
            tabIndex,
            chooseData
        })
    },
    // 模态框显示
    showModalWindow() {
        // 显示确认框
        this.confirmBox.show({
            entryMode: 1, //
            label: this.data.label || '',
            chooseData: this.data.chooseData
        })
    },
    // 设置设备
    setDevice() {
        let tabIndex = this.data.tabIndex
        let chooseData = this.data.chooseData
        let sn = this.data.sn
        let data = {
            id: chooseData.id,
            mcc: chooseData.mcc,
            name: chooseData.name,
            region: chooseData.region,
            terminalId: chooseData.terminalId,
            transFlg: chooseData.transFlg
        }
        if (tabIndex == 0) { // 如果是默认模式就不调设置设备的接口直接显示确认框
            this.showModalWindow() // 成功之后显示确认框

        } else {
            app.api.setDeviceVendor({
                params: {
                    sn
                },
                data,
                success: res => {
                    this.showModalWindow() // 成功之后显示确认框
                }
            })
        }
    },
    // 设置设备类型
    setDeviceType() {
        let sn = this.data.sn
        let tabIndex = this.data.tabIndex
        let type = tabIndex == 0 ? 'DEFAULT' : 'SPECIFIED'
        app.api.setDeviceVendorType({
            params: {
                sn,
                type
            },
            success: res => {
                this.setDevice() // 设置完类型后再去设置设备
            }
        })
    },
    // 保存按钮
    save() {
        if (!this.data.canSave) return
        this.setDeviceType()
    }
})