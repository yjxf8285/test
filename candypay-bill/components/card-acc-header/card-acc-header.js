/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-03-25 16:24:04
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
    ready() {

    },
    methods: {
        editCard(e) {
            let cardData = this.data.cardData
            let cardModel = JSON.stringify(cardData);
            wx.navigateTo({
                url: '/package-a/add-card/add-card?entryMode=editCard&card=' + cardModel
            })
        }
    }
})