/*
 * 市选择器 2列
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2020-04-08 10:02:38
 * @LastEditTime: 2020-04-09 16:59:13
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
            provinceId: '',
            cityName: '',
            cityId: '',
        },
        multiIndex: [0, 0],
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
                let multiArray = [
                    ProvinceList,
                    defCitytList
                ]
                that.setData({
                    ProvinceList,
                    multiArray
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
                        that.setData({
                            "multiArray[1]": cityList,
                            "multiIndex[0]": val,
                            "multiIndex[1]": 0,
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
            let curLocationData = {
                provinceName: curProvince.name || '',
                provinceId: curProvince.code || '',
                cityName: curCity.name || '',
                cityId: curCity.code || '',
            }
            this.setData({
                curLocationData
            })
            this.triggerEvent('onselect', curLocationData)
        },
    }
})