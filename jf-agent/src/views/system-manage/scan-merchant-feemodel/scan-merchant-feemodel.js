/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-03 15:58:32
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/system-manage/operator-manage/operator-manage.js
 */
export default {
  data() {
    return {
      licenseNo: '',
      isCheck: '',
      showAdd: false
    }
  },
  methods: {
    showFunction() {
      this.showAdd = true
    }
  }
}
