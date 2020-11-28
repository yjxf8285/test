/*
 * mcc 单列选择器
 * 用户只能选择大类，然后组件自动为其选择子类
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-05-16 17:58:23
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2019-06-14 10:16:00
 */

const app = getApp()
Component({
    properties: {
        mccId: {
            type: Number,
            value: 0
        },
    },
    data: {
        groupId: '',
        categoryName: '请选择',
        formatMccData: [],
        index: [0],
    },
    ready() {
        this.getMcc()
    },
    methods: {
        // 获取分类数据
        getMcc() {
            let that = this
            let mccList = wx.getStorageSync('mccList')
            that.formatMcc(mccList)
        },
        // 格式化分类数据
        formatMcc(mccMap) {
            let uniqMcc = []
            let formatMccData = []
            let tempObj = {}
            let groupName = this.data.groupName
            // 先去重
            mccMap.forEach(function (item) {
                if (!tempObj[item.groupName]) {
                    uniqMcc.push(item)
                    tempObj[item.groupName] = 1
                }
            })
            // 格式化分类
            uniqMcc.forEach(m => {
                formatMccData[m.category] = {
                    category: m.category,
                    categoryName: m.categoryName,
                    groupList: []
                }
            })
            // 格式化组
            uniqMcc.forEach(m => {
                formatMccData.forEach((mm, ii) => {
                    if (ii == m.category) {
                        mm.groupList.push({
                            groupName: m.groupName,
                            group: m.group,
                        })

                    }
                })
            })
            formatMccData.splice(0, 1)
            this.setData({
                formatMccData
            })
        },
        pickerChange: function (e) {
            let val = e.detail.value || 0
            let formatMccData = this.data.formatMccData || []
            let categroyObj = formatMccData[val] || {}
            let groupList = formatMccData[val].groupList || []
            let categoryName = categroyObj.categoryName || ''
            let groupId = groupList[0].group || ''
            this.setData({
                groupId,
                categoryName
            })
            this.triggerEvent('onselect', groupId)
        }

    }
})