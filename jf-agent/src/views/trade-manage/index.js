/*
 * @Author: wuyulong
 * @Date: 2019-12-27 10:24:04
 * @LastEditTime : 2020-01-03 14:13:54
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/index.js
 */
export default {
  data() {
    return {
      hasTask: true
    }
  },
  methods: {
    changeTask() {
      this.hasTask = !this.hasTask
    },
    taskLoad() {

    }
  }
}
