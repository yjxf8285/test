/*
 * mcc 选择器 双列版
 * @Author: Liuxiaofan
 * @Date: 2018-09-18 15:15:03
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-10-15 15:42:38
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
        groupName: '请选择',
        formatMccData: [],
        rangeArray: [
            [],
            []
        ],
        multiIndex: [0, 0],
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
            // 如果提供mccId就把对应的groupName显示出来
            if (this.data.mccId) {
                mccMap.forEach(m => {
                    if (m.id == this.data.mccId) {
                        groupName = m.groupName
                    }
                })
            }
            this.setData({
                groupName,
                formatMccData
            })
            this.setPickerData()
        },
        setPickerData() {
            let formatMccData = this.data.formatMccData
            let cateList = formatMccData.map(m => m.categoryName)
            let gorpList = formatMccData[0].groupList.map(m => m.groupName)
            this.setData({
                rangeArray: [
                    cateList,
                    gorpList
                ]
            })
        },
        columnChange: function (e) {
            let formatMccData = this.data.formatMccData
            var data = {
                rangeArray: this.data.rangeArray,
                multiIndex: this.data.multiIndex
            };
            data.multiIndex[e.detail.column] = e.detail.value;
            switch (e.detail.column) {
                case 0:
                    let gorpList = formatMccData[e.detail.value].groupList.map(m => m.groupName)
                    data.rangeArray[1] = gorpList
                    break;
            }
            this.setData(data);
        },
        pickerChange: function (e) {
            let val = e.detail.value
            let formatMccData = this.data.formatMccData
            let groupObj = formatMccData[val[0]].groupList[val[1]]
            this.setData({
                groupId: groupObj.group,
                groupName: groupObj.groupName
            })
            this.triggerEvent('onselect', groupObj.group)
        }
       
    }
})