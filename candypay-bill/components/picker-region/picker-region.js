/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-07 20:02:38
 * @LastEditTime: 2020-04-15 17:08:40
 */

const app = getApp()
const util = require('../../utils/util.js')
Component({
    properties: {
        merchantRegion: { //地区码
            type: Number,
            value: 0
        },
        // = entryMode 设备能选当前省的列表，卡选所有绑定省的列表
        formListIndex: {
            type: Number,
            value: 2 // 1设备；2卡片；3手账
        },
        pr: {
            type: Object
        }
    },
    data: {
        provinceList: [], // region接口整理后的省列表数据
        cityList: [], // region接口整理后的市列表数据
        curLocationData: { // 已选择的省市id和名称
            provinceName: '请选择',
            provinceId: 0,
            cityName: '请选择',
            cityId: 0
        },
        pickerRegionDisable: false,
        objectMultiArray: [], // 格式化后所有省市的数组数据
        multiIndex: [0, 0], // 多列选择器2个列的索引数据
        multiArray: [], // 多列选择器使用的数组
    },
    ready() {
        let that = this
        app.getWxAuthorized(isAuthorized => {
            if (!isAuthorized) return // 没授权就打断
            let that = this
            app.eb.on('getRegion', function (regionList) {
                that.formatRegion(regionList)
                return
            })
            this.getRegion()
            let merchantRegion = this.data.merchantRegion
            // merchantRegion=5734
            // this.setLocationPickerList(merchantRegion)

        })

        if (this.data.pr) {
            if (this.data.pr.disable != undefined) {
                this.setData({
                    pickerRegionDisable: that.data.pr.disable
                })
            }
        }
    },
    methods: {
        // 根据已绑定的pos用户的地域信息过滤出来可供选择的地域列表
        setLocationPickerList(cityId) {
            console.info(cityId)
            let formListIndex = this.data.formListIndex
            let accountList = app.globalData.accountList
            let objectMultiArray = this.data.objectMultiArray
            let provinceList = this.data.provinceList
            let multiArray = this.data.multiArray
            let filteredProvinceList = []
            let parid = (cityId + '').slice(0, 2)
            let list = []
            // 2是卡列表过来的就可以选当前账号绑定所有pos的所在省
            if (formListIndex == 2) {
                accountList.forEach(account => {
                    provinceList.forEach(province => {
                        let proId = account.merchantRegion + ''
                        if (proId.slice(0, 2) == province.regid) {
                            filteredProvinceList.push(province)
                        }
                    })
                })
                if (accountList.length == 0) return
                parid = (accountList[0].merchantRegion + '').slice(0, 2)
            }
            // 1是pos列表过来的，只能选当前pos商户的所在省
            else if (formListIndex == 1) {
                provinceList.forEach(province => {
                    cityId = cityId + ''
                    if (cityId.slice(0, 2) == province.regid) {
                        filteredProvinceList.push(province)
                    }
                })
            }


            objectMultiArray.forEach(item => {
                if (item.parid == parid) {
                    list.push(item)
                }
            })
console.info(multiArray)
            filteredProvinceList = util.uniqueMap(filteredProvinceList, 'regid')// 去重
            multiArray[0] = filteredProvinceList
            multiArray[1] = list
            this.setData({
                multiArray,
                objectMultiArray,
                provinceList: filteredProvinceList
            })
            this.setCurRegion(cityId)
        },
        // 设置当前省市
        setCurRegion(cityId) {
            cityId = cityId + ''
            let provinceId = cityId.slice(0, 2) //省码
            let provinceList = this.data.provinceList // region接口整理后的省列表数据
            let cityList = this.data.cityList // region接口整理后的市列表数据
            let provinceName = '请选择'
            let cityName = '请选择'
            provinceList.forEach(m => {
                if (m.regid == provinceId) {
                    provinceName = m.regname
                }
            })
            cityList.forEach(m => {
                if (m.regid == cityId) {
                    cityName = m.regname
                }
            })
            let curLocationData = { // 已选择的省市id和名称
                provinceName,
                provinceId,
                cityName,
                cityId
            }
            this.setData({
                curLocationData
            })
            this.triggerEvent('onselect', curLocationData)
        },
        // 获取地区数据
        getRegion() {
            let that = this
            let regionList = wx.getStorageSync('regionList')
            if (regionList.length > 0) {
                that.formatRegion(regionList)
            }
        },
        // 格式化地区数据
        formatRegion(regionList) {
            let provinceList = [] //所有省的列表
            let cityList = [] //所有市的列表
            let defCityList = [] // 默认市列表（北京内）
            let multiArray = []
            let objectMultiArray = []
            // 提取省列表
            regionList.forEach(m => {
                if (m.id.length == 2) {
                    provinceList.push({
                        regid: m.id,
                        regname: m.name
                    })
                }
                if (m.id.length == 4) {
                    cityList.push({
                        regid: m.id,
                        regname: m.name
                    })
                    if (m.id.slice(0, 2) == regionList[0].id) {
                        defCityList.push({
                            regid: m.id,
                            regname: m.name
                        })
                    }
                }

                objectMultiArray.push({
                    regid: m.id,
                    parid: m.parentId,
                    regname: m.name,
                    regtype: m.level
                })
            })
            multiArray = [provinceList, defCityList]
            this.setData({
                provinceList,
                cityList,
                multiArray,
                objectMultiArray
            })
        },
        // 地区控件列confirm事件触发
        locationPickerConfirm(e) {
            let multiArray = this.data.multiArray
            let curProvince = multiArray[0][e.detail.value[0]]
            let curCity = multiArray[1][e.detail.value[1]]
            let curLocationData = { // 已选择的省市id和名称
                provinceName: curProvince.regname,
                provinceId: curProvince.regid,
                cityName: curCity.regname,
                cityId: curCity.regid
            }
            this.setData({
                curLocationData
            })
            app.globalData.adcode = curLocationData.cityId
            this.triggerEvent('onselect', curLocationData)
        },
        // 地区控件列change事件触发
        locationPickerColumnChange(e) {

            let that = this
            let provinceList = this.data.provinceList
            let objectMultiArray = this.data.objectMultiArray
            let val = e.detail.value

            switch (e.detail.column) {
                case 0:
                    let list = []
                    let parid = provinceList[val].regid //当前选中的省的id
                    objectMultiArray.forEach(item => {
                        if (item.parid == parid) {
                            list.push(item)
                        }
                    })
                    that.setData({
                        "multiArray[1]": list,
                        "multiIndex[0]": val,
                        "multiIndex[1]": 0
                    })
                    break
                case 1:
                    break
            }
        }
       
    }
})