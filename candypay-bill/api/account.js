/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-29 16:21:20
 */
export default {
    getAccountSummary: {
        url: 'account/summary',
    },
    // requestType：UPGRADE=商户提额 POSLIST=我的商户 USERCENTER=个人中心 我的商户 TRANSICATION=交易查询
    getMerchantList: {
        url: 'account/all',
        method: 'get'
    },
    bindMerchant: {
        url: 'account',
        method: 'post'
    },
    getAccountByEncSn: {
        url: 'account/pos',
        method: 'get',
        block: 'single'
    },
    unbindMerchant: {
        url: 'account/remove',
        method: 'post'
    },
    setDefMerchant: {
        url: 'account/type',
        method: 'post'
    },
    creatMerchant: {
        url: 'account/remote',
        method: 'post'
    },
    accountStatus: {
        url: 'account/status',
        method: 'post'
    },
   
}