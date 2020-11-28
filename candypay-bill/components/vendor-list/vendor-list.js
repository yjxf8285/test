/*
 * @Author: Liuxiaofan 
 * @Date: 2018-09-04 16:50:15 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-11-03 11:39:17
 */
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        deviceData: {
            type: Object,
            value: {}
        },
        entryMode: {
            type: Number,
            value: 1 // 1设备；2卡片；3手账
        }
    },
    data: {
        listData: []
    },
    methods: {
        refresh(pramas, onReachBottom) {
            let deviceData = this.data.deviceData
            let that = this
            let region = pramas.cityId
            let mccGroup = ''
            let defMerchantData = {
                id: deviceData.merchantId,
                mcc: deviceData.merchantMcc,
                name: deviceData.merchantName,
                region: deviceData.merchantRegion,
                terminalId: '',
                transFlg:-1,
                default: true
            }
            if (pramas.group.length > 0) {
                mccGroup = pramas.group[0].id
            }

            // if (onReachBottom && this.data.listData.length < 20) return //小与20条数据就不刷新了
            that.setData({
                listData: []
            })
            app.api.getVendor({
                data: {
                    region,
                    mccGroup,
                    size: 20
                },
                success(res) {
                    let listData = []
                    if (that.data.entryMode == 1) { // 如果是设备模式就再列表前面加一条默认数据
                        listData = [defMerchantData, ...res.payload]
                    } else {
                        listData = res.payload || []
                    }
                    listData.forEach(m => {
                        // m.mccName = app.getMccName(m.mcc)
                        // m.regionName = app.getRegionName(m.region, 1)
                        m.vendorRegionName = app.getRegionName(m.region, true) // 设备地区
                        m.vendorMccCategoryName = app.getMccCategoryName(m.mcc) // 设备大类
                        m.vendorMccGroupName = app.getMccGroupName(m.mcc) // 设备组名
                        m.cur = false
                    })

                    that.setData({
                        listData
                    })
                    that.triggerEvent('ongetvendor', listData)
                },
                complete() {
                    // 停止下拉动作
                    wx.stopPullDownRefresh();
                }
            })
        },
        selectItem(e) {
            let item = e.currentTarget.dataset.item
            let listData = this.data.listData
            listData.forEach(m => {
                if (m.id == item.id) {
                    m.cur = true
                } else {
                    m.cur = false
                }
            });
            this.setData({
                listData
            })
            this.triggerEvent('onselect', item)
        }
    }
})