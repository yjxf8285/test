/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-03-20 19:09:35
 */
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
        accountType: 1 //1:速记 2:手账
    },
    ready() {

    },
    methods: {
        onTabClick({ detail }) {
            this.setData({
                accountType: detail
            })
        },
    }
})