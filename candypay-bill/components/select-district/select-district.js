/*
 * 区选择器 3列
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2020-04-08 10:02:38
 * @LastEditTime: 2020-04-09 15:48:33
 */

const app = getApp()
// const util = require('../../utils/util.js')
// const regionJs = require('../../data/province.js')
Component({
    properties: {

    },
    data: {
        ProvinceList: [], // 省列表数据
        curLocationData: { // 已选择的省市id和名称
            provinceName: '',
            provinceId: 0,
            cityName: '',
            cityId: 0,
            districtName: '',
            districtId: 0
        },
        multiIndex: [0, 0, 0], // 多列选择器3个列的索引数据
        multiArray: [], // 多列选择器使用的数组
    },
    ready() {
        this.getProvince() //获得省份列表 徐琦的添加商户和绑定结算卡需要用到
    },
    methods: {
        //获取省份列表
        getProvince() {
            let that = this
            app.api.getProvince({
                success(res) {
                    let ProvinceList = res.payload || []
                    if (ProvinceList.length > 0) {
                        that.formatRegion(ProvinceList)
                    }
                }
            })
        },
        // 格式化地区数据
        formatRegion(ProvinceList) {
            let that = this
            // 获取城市列表
            this.getRegionListByParentCode(ProvinceList[0].code, (defCitytList) => {
                // 再根据市id获取区列表
                that.getRegionListByParentCode(defCitytList[0].code, (defDistrictList) => {
                    // 选择器的3列数据
                    let multiArray = [
                        ProvinceList,
                        defCitytList,
                        defDistrictList
                    ]
                    that.setData({
                        ProvinceList,
                        multiArray
                    })
                })
            })
        },
        //根据父级id获取子地区列表
        getRegionListByParentCode(parentCode, cb) {
            app.api.getRegionListByParentCode({
                params: {
                    parentCode
                },
                success(res) {
                    let childList = res.payload || []
                    childList.forEach(item => {
                        // item.regid = item.code
                        // item.regname = item.name
                    })
                    cb & cb(childList)
                }
            })

        },
        // 地区控件列change事件触发
        locationPickerColumnChange(e) {
            let that = this
            let ProvinceList = this.data.ProvinceList
            let multiArray = this.data.multiArray
            let val = e.detail.value
            switch (e.detail.column) {
                case 0:
                    let ProvCode = ProvinceList[val].code //当前选中的省的id
                    that.getRegionListByParentCode(ProvCode, cityList => {
                        that.getRegionListByParentCode(cityList[0].code, districtList => {
                            that.setData({
                                "multiArray[1]": cityList,
                                "multiArray[2]": districtList,
                                "multiIndex[0]": val,
                                "multiIndex[1]": 0,
                                "multiIndex[2]": 0,
                            })
                        })
                    })
                    break
                case 1:
                    let cityid = multiArray[1][val].code //当前选中的市的id
                    // let districts = that.getDistrictList(cityid)
                    that.getRegionListByParentCode(cityid, districts => {
                        that.setData({
                            "multiArray[2]": districts,
                            "multiIndex[1]": val,
                            "multiIndex[2]": 0,
                        })
                    })

                    break
            }
        },
        // 地区控件列confirm事件触发
        locationPickerConfirm(e) {
            let multiArray = this.data.multiArray
            let curProvince = multiArray[0][e.detail.value[0]] || {}
            let curCity = multiArray[1][e.detail.value[1]] || {}
            let curDistrict = multiArray[2][e.detail.value[2]] || {}
            let curLocationData = { // 已选择的省市id和名称
                provinceName: curProvince.name || '',
                provinceId: curProvince.code || '',
                cityName: curCity.name || '',
                cityId: curCity.code || '',
                districtName: curDistrict.name || '',
                districtId: curDistrict.code || ''
            }
            this.setData({
                curLocationData
            })

            this.triggerEvent('onselect', curLocationData)
        },
    }
})