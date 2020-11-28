/*
 * @Author: wuyulong
 * @Date: 2019-12-26 16:42:19
 * @LastEditTime : 2019-12-27 09:51:27
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/preference-merchant/preference-merchant.js
 */
export default {
  data() {
    return {
      preferType: '',
      doBegin: '',
      doEnd: '',
      doResult: '',
      doType: '',
      dialogVisible: false,
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
}
