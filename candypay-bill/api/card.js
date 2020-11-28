/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-08 16:48:09
 */
export default {
    getCardBin: {
        url: 'card/bin',
        method: 'get'
    },
    getCard: {
        url: 'card',
        method: 'get'
    },
    bindCard: {
        url: 'card',
        method: 'post'
    },
    delCard: {
        url: 'card/remove',
        method: 'post'
    },
    cardVendorStatus: {
        url: 'card/vendor/status',
        method: 'post'
    },
    setCardVendor: {
        url: 'card/vendor',
        method: 'post'
    },
    setCardVendorType: {
        url: 'card/vendor/type',
        method: 'post'
    },
    updateCard: {
        url: 'card',
        method: 'put'
    },
    getCardVerificationCode: {
        url: 'card/verify/code',
        method: 'get'
    },
    cardVerify: {
        url: 'card/verify',
        method: 'post'
    },
    getCardListSearch:{
        url:'card/search'
    },
    creditcardVerify: {
        url: 'creditcard/verify',
        method: 'post'
    },
    getCreditcardVerifyCode: {
        url: 'creditcard/verify/code',
    },
    saveCustomerSettleCard:{
        url: 'saveCustomerSettleCard',
        method: 'post'
    }
}