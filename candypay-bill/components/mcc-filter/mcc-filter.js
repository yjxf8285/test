/*
 * @Author: Liuxiaofan
 * @Date: 2018-09-18 15:15:03
 * @Last Modified by: Hu
 * @Last Modified time: 2019-01-15 18:07:43
 */
const app = getApp()
let defTypeName = '全部'
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        cardNo: {
            type: Number,
            value: 0
        },
        showDrawer: {
            type: Boolean,
            value: false
        },
        mccId: {
            type: Number,
            value: 0
        },
    },
    data: {
        // 格式化后的mcc数据
        formatMccData: [],
        // 用来展示的分类
        category: {
            id: '',
            name: '全部'
        },
        // 用来展示的组
        group: [{
            id: '',
            name: defTypeName
        }],
        // 选中的组类
        curGroupData: {
            id: '',
            name: defTypeName
        },
    },
    ready() {
        // this.getMcc()
    },
    methods: {
        // 获取分类数据
        getMcc() {
            let that = this
            let mccList = wx.getStorageSync('mccList') || []
            // that.formatMcc(mccList) //注释掉原因：添加了猜你喜欢的数据
            this.getRecommendData(mccList)
        },
        // 获取推荐MCC
        getRecommendData(mccList) {
            let that = this
            let modeType = app.globalData.modeType
            if (modeType == 'CARD') {
                app.api.getRecommend({
                    url: 'recommend/' + this.data.cardNo,
                    success(res) {
                        let data = res.payload || []
                        data.forEach(m => {
                            let recommendData = m
                            recommendData.category = 0
                            recommendData.categoryName = '猜您喜欢'
                            mccList.unshift(recommendData)
                        })
                        that.formatMcc(mccList)
                    }
                })
            } else {
                app.api.getRecommend({
                    success(res) {
                        let data = res.payload || []
                        data.forEach(m => {
                            let recommendData = m
                            recommendData.category = 0
                            recommendData.categoryName = '猜您喜欢'
                            mccList.unshift(recommendData)
                        })
                        that.formatMcc(mccList)
                    }
                })
            }

        },
        // 格式化分类数据
        formatMcc(mccMap) {
            let uniqMcc = []
            let formatMccData = []
            let tempObj = {}
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
                    groupList: [],
                    simGroupList: [],
                    showSim: true
                }
            })
            // 格式化组
            uniqMcc.forEach(m => {
                formatMccData.forEach((mm, ii) => {
                    if (ii == m.category) {
                        mm.groupList.push({
                            category: m.category,
                            categoryName: m.categoryName,
                            groupName: m.groupName,
                            group: m.group,
                            cur: false,
                            disabled: false // 因为业务需求取消了disable的逻辑，所以这里默认改成了false
                        })
                        mm.simGroupList.push({
                            category: m.category,
                            categoryName: m.categoryName,
                            groupName: m.groupName,
                            group: m.group,
                            cur: false,
                            disabled: false // 因为业务需求取消了disable的逻辑，所以这里默认改成了false
                        })
                        mm.simGroupList = mm.simGroupList.slice(0, 9) //默认列表最多显示9个项目也就是3行
                    }
                })
            })
            if (!formatMccData[0]) {//数组按分类id索引，如果0位无数据所以要删除
                formatMccData.splice(0, 1)
            }
            this.setData({
                formatMccData
            })
        },
        // 单选的方式 后期可能还会有多选，到时候再加个多选的方法
        singleSelectGroup(item) {
            let formatMccData = this.data.formatMccData
            let groupItem = item.target.dataset.item
            let disabled = groupItem.disabled
            let that = this
            if (disabled) return
            formatMccData.forEach(m => {
                function setCur(mm) {
                    if (mm.group == groupItem.group) {
                        mm.cur = true
                        that.setData({
                            curGroupData: mm
                        })
                    } else {
                        mm.cur = false
                    }
                }
                m.groupList.forEach(mm => {
                    setCur(mm)
                })

                m.simGroupList.forEach(mm => {
                    setCur(mm)
                })

            })
            this.setData({
                formatMccData
            })
        },
        // 选择分类弹窗的重置按钮
        reset() {
            let formatMccData = this.data.formatMccData
            let that = this
            formatMccData.forEach(m => {
                m.groupList.forEach(mm => {
                    mm.cur = false
                })
                m.simGroupList.forEach(mm => {
                    mm.cur = false
                })

            })
            this.setData({
                formatMccData,
                curGroupData: {},
                category: {
                    id: '',
                    name: '全部'
                },
                group: [{
                    id: '',
                    name: defTypeName
                }]
            })
        },
        // 选择分类弹窗的确认按钮
        comfirm() {
            let curGroupData = this.data.curGroupData || {}
            let category = {
                id: '',
                name: '全部'
            }
            let group = [{
                id: '',
                name: defTypeName
            }]
            if (JSON.stringify(curGroupData) == "{}") {
                category = {
                    id: '',
                    name: '全部'
                }
                group = [{
                    id: '',
                    name: defTypeName
                }]
            } else {
                category = {
                    id: curGroupData.category || '',
                    name: curGroupData.categoryName || defTypeName
                }
                group = [
                    {
                        id: curGroupData.group || '',
                        name: curGroupData.groupName || defTypeName
                    }
                ]
            }

            this.setData({
                category,
                group,
                showDrawer: false
            })
            this.triggerEvent('onmccfilterselected', {
                category,
                group,
            })
            this.triggerEvent('setnoscroll', false)
            this.reset()
        },
        // 打开弹窗
        openDrawer() {
            this.getMcc()
            this.setData({
                showDrawer: true
            });
        },
        //关闭弹窗
        closeDrawer() {
            this.triggerEvent('setnoscroll', true)
            this.reset()
            this.setData({
                showDrawer: false
            });
        },
        // 
        toggleSimData(item) {
            let formatMccData = this.data.formatMccData
            let categoryItem = item.target.dataset.item
            formatMccData.forEach(m => {
                if (categoryItem.category == m.category) {
                    m.showSim = !m.showSim
                }
            })
            this.setData({
                formatMccData
            })
        },
        myCatchTouch() { }
    }
})