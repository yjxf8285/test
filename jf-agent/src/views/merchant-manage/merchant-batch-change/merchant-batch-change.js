/*
 * @Author: wuyulong
 * @Date: 2019-12-26 14:50:33
 * @LastEditTime : 2019-12-26 15:44:33
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/merchant-batch-change/merchant-batch-change.js
 */
export default {
  data() {
    return {
      productName: '',
      doState: '',
      doType: '',
      doBeginDate: '',
      doBeginEnd: ''
    }
  },
  methods: {
    queryCustomer() {
      this.$alert('无符合条件的查询结果', '提示')
    }
  }
}
