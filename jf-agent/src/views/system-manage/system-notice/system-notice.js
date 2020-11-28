/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-08 11:58:34
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/system-manage/operator-manage/operator-manage.js
 */
export default {
  data() {
    return {
      loginName: '',
      trueName: '',
      agentNo: '',
      agentList: [{
        noticeTitle: '所有服务商代理商按地区、服务商发布',
        createTime: '19-11-05 10:53',
        doTime: '19-11-05 10:53',
        lostTime: '20-01-29 10:53'
      }],
      visibleDialog: false,
      startTime: '',
      endTime: ''
    }
  },
  methods: {
    detailNotice() {
      this.visibleDialog = true
    }
  }
}
