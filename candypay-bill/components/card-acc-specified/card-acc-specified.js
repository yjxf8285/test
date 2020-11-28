/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-06-14 15:32:10
 */
const app = getApp()
const util = require('../../utils/util.js')
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        cardData: {
            type: Object,
            value: null
        }
    },
    data: {
        canSave: false,
        chooseData: {}
    },
    ready() {
        this.confirmBox = this.selectComponent('#confirm-box')
    },
    methods: {
        onTabClick() {
            this.triggerEvent('onTabClick', 2)
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
                chooseData
            })
        },
        // 模态框显示
        showModalWindow() {
            // 显示确认框
            this.confirmBox.show({
                entryMode: 2, //
                label: this.data.label || '',
                chooseData: this.data.chooseData
            })
        },
        setSelectedInfo() {
            let cardData = this.data.cardData
            let chooseData = this.data.chooseData
            cardData.vendorName = chooseData.vendorName
            cardData.vendorType = 'SPECIFIED'
            cardData.vendorRegionName = app.getRegionName(chooseData.region, true) // 设备地区
            cardData.vendorMccCategoryName = app.getMccCategoryName(chooseData.mcc) // 设备大类
            cardData.vendorMccGroupName = app.getMccGroupName(chooseData.mcc) // 设备组名
            this.setData({
                cardData
            })
        },
        // 设置卡片商户
        setCardVendor() {
            let that = this
            let cardNo = this.data.cardData.cardNo
            let chooseData = this.data.chooseData
            let data = {
                id: chooseData.id,
                mcc: chooseData.mcc,
                name: chooseData.name,
                region: chooseData.region,
                terminalId: chooseData.terminalId,
                transFlg: chooseData.transFlg
            }
            app.api.setCardVendor({
                params: {
                    cardNo
                },
                data,
                success() {
                    // that.setSelectedInfo()
                    that.showModalWindow()
                }
            })
        },
        // 设置卡商户类型
        setCardVendorType() {
            let that = this
            let cardNo = this.data.cardData.cardNo
            app.api.setCardVendorType({
                params: {
                    cardNo,
                    type: 'SPECIFIED'
                },
                success() {
                    that.setCardVendor()
                }
            })
        },
        // 保存按钮
        save() {
            if (!this.data.canSave) return
            this.setCardVendorType()
        }
    }
})