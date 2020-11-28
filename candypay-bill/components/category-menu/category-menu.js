/*
 * @Author: Liuxiaofan 
 * @Date: 2018-09-04 16:49:59 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-11-07 11:30:20
 */
const app = getApp()
const util = require('../../utils/util.js')
let defTypeName = '全部'
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        noscroll: { //解决滚动穿透问题
            type: Boolean,
            value: false
        },
        deviceData: { // 一条设备的数据
            type: Object,
            value: {}
        },
        merchantRegion: {
            type: Number,
            value: 0
        },
        // = entryMode 设备能选当前省的列表，卡选所有绑定省的列表
        formListIndex: {
            type: Number,
            value: 1 // 1设备；2卡片；3手账
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
        multiIndex: [0, 0], // 多列选择器2个列的索引数据
        multiArray: [], // 多列选择器使用的数组
        objectMultiArray: [], // 格式化后所有省市的数组数据
        category: { // 用来展示的分类
            id: '',
            name: '全部'
        },
        group: [{
            id: '',
            name: defTypeName
        }],// 用来展示的组
        curGroupData: {
            id: '',
            name: defTypeName
        }, // 选中的组类


    },
    ready() {
        let merchantRegion = this.data.merchantRegion

        this.getRegion()
        if (!merchantRegion || this.data.formListIndex == 3) { // 手动账单页面过来或者没有传入地区码就走定位
            this.loadInfo()
        } else {
            this.setLocationPickerList(merchantRegion)
        }
        this.onFilter()
    },
    methods: {
        // 刷新按钮
        refresh() {
            this.onFilter()
        },
        // 行业筛选按钮被点击
        onClickFilterBtn({ detail }) {
            this.triggerEvent('onclickfilterbtn', detail)
        },
        // 子组件重新获取商户后触发
        onGetVendor({ detail }) {
            this.triggerEvent('ongetvendor', detail)
        },
        // 子组件选完商户后触发
        onSelectVendor({ detail }) {
            this.triggerEvent('onselect', detail)
        },
        // 筛选之后调用
        onFilter(pramas = null, onReachBottom = false) {
            let cityId = this.data.curLocationData.cityId
            // 如果传入参数，就用新的，否则用已选的
            if (pramas) {
                this.setData({
                    category: pramas.category || {},
                    group: pramas.group || {},
                })
            }

            this.selectComponent("#vendor-list").refresh({
                cityId,
                category: this.data.category, // 这个版本用不上这个字段了，但是保留着
                group: this.data.group
            }, onReachBottom)
        },
        // 通过判断地区设置分类可选状态
        getVendorGroupData() {
            let that = this
            let cityId = this.data.curLocationData.cityId
            let formatMccData = this.data.formatMccData
            if (cityId == 0) return //如果是默认值就不请求
            this.onFilter({
                cityId,
                group: [
                    {
                        id: '',
                        name: defTypeName
                    }
                ]
            })
            app.api.getVendorGroup({
                data: {
                    region: cityId
                },
                success(res) {
                    let ableList = res.payload
                    formatMccData.forEach(m => {
                        let validGroupList = []
                        let validSimGroupList = []
                        m.groupList.forEach(mm => {
                            // 可用状态控制
                            // if (ableList.includes(mm.group)) {
                            //     mm.disabled = false
                            // }
                            // 删除不可用的项目
                            if (ableList.includes(mm.group)) {
                                validGroupList.push(mm)
                            }
                        })
                        m.simGroupList.forEach(mm => {
                            // 可用状态控制
                            // if (ableList.includes(mm.group)) {
                            //     mm.disabled = false
                            // }
                            // 删除不可用的项目
                            if (ableList.includes(mm.group)) {
                                validSimGroupList.push(mm)
                            }
                        })
                        m.groupList = validGroupList
                        m.simGroupList = validSimGroupList
                        m.simGroupList = m.simGroupList.slice(0, 9) //默认列表最多显示9个项目也就是3行
                    })
                    // that.reset()
                    that.setData({
                        category: {
                            id: '',
                            name: '全部'
                        },
                        group: [{
                            id: '',
                            name: defTypeName
                        }],
                        formatMccData
                    })

                }
            })
        },
        // 根据已绑定的pos用户的地域信息过滤出来可供选择的地域列表
        setLocationPickerList(cityId) {
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
            this.setData({
                curLocationData: { // 已选择的省市id和名称
                    provinceName,
                    provinceId,
                    cityName,
                    cityId
                }
            })
            // this.getVendorGroupData()
        },
        // 获取地区数据
        getRegion() {
            let that = this
            let regionList = wx.getStorageSync('regionList') || []
            that.formatRegion(regionList)
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
            let cityId = curCity.regid
            let curLocationData = { // 已选择的省市id和名称
                provinceName: curProvince.regname,
                provinceId: curProvince.regid,
                cityName: curCity.regname,
                cityId
            }
            this.setData({
                curLocationData,
                cityId,
                group: [
                    {
                        id: '',
                        name: defTypeName
                    }
                ]
            })
            this.onFilter({
                cityId,
                group: [
                    {
                        id: '',
                        name: defTypeName
                    }
                ]
            })
            // this.getVendorGroupData()

        },
        // 地区控件列change事件触发
        locationPickerColumnChange(e) {
            let list = []
            let that = this
            let provinceList = this.data.provinceList
            let objectMultiArray = this.data.objectMultiArray
            let val = e.detail.value
            switch (e.detail.column) {
                case 0:
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
        },
        // 删除已选中的组类
        delItem(e) {
            return //暂时去掉删除功能
            let item = e.currentTarget.dataset.item
            let group = this.data.group
            let cityId = this.data.curLocationData.cityId
            group.splice(group.findIndex(m => m.id === item.id), 1)
            this.setData({
                category: {
                    id: '',
                    name: defTypeName
                },
                group
            })
            this.reset()
            this.onFilter({
                cityId,
                group
            })
        },
        // 定位经纬度
        loadInfo() {
            return // key使用次数到上限了，暂时关闭定位功能
            let that = this
            if (app.globalData.adcode) {
                that.setCurRegion(app.globalData.adcode)
                return
            }
            app.scopeLocation({
                scopeLocationSuccess: function () {
                    wx.getLocation({
                        success: function (res) {
                            var longitude = res.longitude //经度
                            var latitude = res.latitude //纬度
                            that.loadCity(longitude, latitude)
                        }
                    })
                }
            })
        },
        // 腾讯地图API通过经纬度获取adcode
        loadCity(longitude, latitude) {
            let that = this
            // let keyStr = '5YIBZ-HGW66-42KSJ-MARXC-UTGKO-Y6BSV' //这key有使用的次数限制，记得及时更换
            let keyStr = 'Q7IBZ-S3ZHQ-UAL5N-GOOHM-3MCKV-ZTFKV' //企业账号
            wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + keyStr,
                success: function (res) {
                    if (res.data.status != 0) {
                        console.log('地址逆袭api请求失败：', res.data.message)
                        return
                    }
                    let adcode = res.data.result.ad_info.adcode.slice(0, 4)// 截取前4位
                    that.setCurRegion(adcode)
                }
            })
        },
        myCatchTouch: function () {
            console.log('stop user scroll it!');
            return;
        },
    }
})