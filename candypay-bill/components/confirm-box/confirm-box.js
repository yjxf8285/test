/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-07 13:45:48
 * @LastEditTime: 2019-06-02 14:53:05
 */
const app = getApp()
const util = require('../../utils/util.js')
Component({
    data: {
        modalShow: false,
        entryMode: 1, //1是设备 2是卡片
        label: '',
        cardDisplayNo: '',
        chooseAccounting: {
            vendorRegionName: "包头市包头市包头市包头市",
            vendorMccCategoryName: "方法对对对方法对对对方法对对对",
            vendorMccGroupName: "到底到底到底到底到底到底",
            MerchantName: "欣宸健康咨询工作室欣宸健康咨询工作室欣宸健康咨询工作室"
        }
    },
    methods: {
        show({
            entryMode = 1,
            label = '',
            cardDisplayNo = '',
            chooseData = {
                name: '',
                mcc: '',
                region: '',
            }
        }) {

            let chooseAccounting = {
                vendorRegionName: app.getRegionName(chooseData.region, true), // 设备地区
                vendorMccCategoryName: app.getMccCategoryName(chooseData.mcc), // 设备大类
                vendorMccGroupName: app.getMccGroupName(chooseData.mcc), // 设备组名
                MerchantName: chooseData.name,
            }

            this.setData({
                modalShow: true,
                entryMode,
                label,
                cardDisplayNo,
                chooseAccounting,
            })

        },
        hide() {
            this.setData({
                modalShow: false
            })
            util.setNavigateBackWithData();
        }
    }
});
