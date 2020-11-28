/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2020-04-23 16:39:29
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-28 10:19:40
 */
/* 上传组件封装
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2020-03-21 18:04:40
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-09 13:38:11
 */
import Config from '../config'
import tokenUtil from './storage-util'
const baseUrl = Config.host
module.exports = {
    upload: function (option) {
        let opt = Object.assign({
            // curl: 'http://localhost:8888/miniprogram/api.php',
            url: 'file',
            params: {},
            data: {},
            name: 'file',
            filePath: '',
            callback: null
        }, option)
        if (JSON.stringify(opt.params) != "{}") {
            let urlParamStr = ''
            Object.keys(opt.params).forEach(m => {
                urlParamStr += m + '=' + opt.params[m] + '&'
            })
            opt.url = opt.url + "?" + urlParamStr.substr(0, urlParamStr.length - 1)
        }
        let url = opt.curl ? opt.curl : baseUrl + opt.url
        let token = tokenUtil.getToken()
        let mpUploadFile = wx.uploadFile({
            url,
            filePath: opt.filePath,
            name: opt.name,
            header: {
                'Authorization': "bearer " + token,
                "Content-Type": "multipart/form-data",
                'accept': 'application/json',
            },
            formData: opt.data,
            success(res) {
                let data = JSON.parse(res.data)
                if (!data.payload) {
                    wx.showModal({
                        title: '提示',
                        content: '上传失败！',
                        showCancel: false,
                    })
                    return
                }
                //json字符串 需用JSON.parse 转
                opt.callback && opt.callback(res)
            }
        })
        return mpUploadFile
    }
}