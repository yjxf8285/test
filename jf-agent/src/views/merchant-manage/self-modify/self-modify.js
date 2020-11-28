/*
 * @Author: wuyulong
 * @Date: 2019-12-20 11:18:53
 * @LastEditTime : 2019-12-20 11:19:03
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/self-modify/self-modify.js
 */
export default {
  data() {
    return {
      customerNo: '',
      dialogVisible: false,

    }
  },
  methods: {
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => { });
    // },
    submitQuery() {
      if (!this.customerNo) {
        this.$alert('请输入商户编号！', '提示')
        return
      }

      // this.$alert("商户不属于服务商！","提示");

      this.$alert('待提交商户不能自助整改！', '提示')
    }
  }
}
