/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-08 10:57:46
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
        loginName: '15859659515',
        trueName: '王建兵',
        agentName: '霍尔果斯银商通电子科技有限公司',
        agentNo: '8624715803',
        type: '普通操作员',
        state: '可用'
      }, {
        loginName: '15859659515',
        trueName: '王建兵',
        agentName: '服务商全程改成三十个汉字汉字汉字汉字汉字汉字汉字汉字汉字汉字',
        agentNo: '8624715803',
        type: '普通操作员',
        state: '可用'
      }, {
        loginName: '15859659515',
        trueName: '王建兵',
        agentName: '霍尔果斯银商通电子科技有限公司',
        agentNo: '8624715803',
        type: '普通操作员',
        state: '可用'
      }],
      visibleDialog: false
    }
  },
  methods: {
    resetPassword() {
      this.$confirm('确认是否重置操作员密码?', '操作提示')
    },
    open() {
      this.$confirm('确认是否对该操作员进行开通?', '操作提示')
    },
    rightManage() {
      this.visibleDialog = true
    },
    closeDialog() {
      this.visibleDialog = false
    },
    close() {
      this.$confirm('确认是否对该操作员进行关闭?', '操作提示')
    }
  }
}
