/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-29 15:38:10
 */
export default {
    getDevice: {
        url: 'device',
    },
    setDeviceVendor: {
        url: 'device/vendor',
        method: 'post'
    },
    setLabel: {
        url: 'device/label',
        method: 'post'
    },
    setDeviceVendorType: {
        url: 'device/vendor/type',
        method: 'post'
    },
    getDeviceDecryption: {
        url: 'device/decryption',
    },
    getDeviceEncryption: {
        url: 'device/encryption',
    },
    getDeviceSummary: {
        url: 'deviceSummary/fromTransaction',
    },
    deviceBind:{
        url: 'device/bind',
        method: 'post'
    },
    deviceCheck:{
        url: 'device/check',
        method: 'post'
    }
}