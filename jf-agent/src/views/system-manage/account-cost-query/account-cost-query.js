/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-06 14:19:38
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/system-manage/operator-manage/operator-manage.js
 */
import { regionDataPlus } from 'element-china-area-data'

export default {
  data() {
    return {
      licenseNo: '',
      doStart: '',
      doEnd: '',
      userRole: '',
      options: regionDataPlus,
      selectedOptions: [],
      kaishua: [{
        title: '2019年Q2开刷活动',
        type: '秒到',
        lowerCost: '0.005',
        D0_1: '0.8',
        D0_2: '1.1',
        D0_3: '2.0',
        time: '2018-01-01',
        lostTime: '2090-01-01'
      }, {
        title: '2019年Q2开刷活动',
        type: '秒到',
        lowerCost: '0.005',
        D0_1: '0.8',
        D0_2: '1.1',
        D0_3: '2.0',
        time: '2018-01-01',
        lostTime: '2090-01-01'
      }, {
        title: '2019年Q2开刷活动',
        type: '秒到',
        lowerCost: '0.005',
        D0_1: '0.8',
        D0_2: '1.1',
        D0_3: '2.0',
        time: '2018-01-01',
        lostTime: '2090-01-01'
      }],
      yunshanfu: [{
        title: '云闪付',
        type: '--',
        lowerCost: '0.00028',
        D0_1: '0.8',
        D0_2: '1.1',
        D0_3: '2.0',
        time: '2018-01-01',
        lostTime: '2090-01-01'
      }]
    }
  },
  methods: {
    handleChange(value) {
      window.console.log(value)
    }
  }
}
