/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-06-15 17:27:02
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-21 10:28:50
 */
// 1、乙方：商户名称
// 2、地址：POS使用地
// 3、负责人签章：签名
// 4、日期：签名时间
// 5、填表日期：签名时间
// 6、商户名称：商户名称
// 7、商户店名：商户名称
// 8、法定代表人：姓名
// 9、法定代表人联系电话：手机号
// 10、法定代表人证件号码：身份证号
// 11、终端布放地址：POS使用地
const app = getApp()
Page({
  data: {
    url: ''
  },
  onLoad(opt) {
    let p = decodeURIComponent(opt.params || '')
    let params = JSON.parse(p || '{}')
    console.info(opt.params)
    let timestamp = new Date().getTime()
    // let host = 'https://liuxiaofan.com/test/'
    let host = 'https://www.ymhz-tech.com/h5/'
    this.setData({
      url: host + 'account-open-agreement.html?params=' + opt.params || '&timestamp=' + timestamp
    })
  },
  webLoad(d) {
    console.info(d)
  },
  webErr(d) {
    console.info(d)
  }
})