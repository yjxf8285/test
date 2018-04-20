<template>
  <router-view></router-view>
</template>
<script>
  import util from '_util'
  import {MessageBox} from 'element-ui'
  export default {
    created() {
      this.setDefaultTime()
      this.ieNotice()
    },
    methods: {
      ieNotice() {
        let str = '提示: 您在使用低版本的IE浏览器，使用不兼容的浏览器可能导致浏览异常，推荐安装Chrome(谷歌浏览器）或Firefox（火狐）浏览器来使用本系统；'
        if (util.ieVersion() !== -1) {
          MessageBox({
            message: str,
            type: 'warning'
          })
        }
      },
      countStartTime(curTimeIndex) {
        let res = 0
        let curTime = new Date().getTime()
        switch (Number(curTimeIndex)) {
          case 0:
            res = curTime - 60000 * 30
            break
          case 1:
            res = curTime - 3600000
            break
          case 2:
            res = curTime - 3600000 * 6
            break
          case 3:
            res = curTime - 3600000 * 12
            break
          case 4:
            res = curTime - 86400000
            break
          case 5:
            res = curTime - 86400000 * 3
            break
          case 6:
            res = curTime - 604800000
            break
          case 7:
            res = curTime - 604800000 * 2
            break
          case 8:
            res = curTime - 2592000000
            break
        }
        return res
      },
      setDefaultTime() {
        let curTimeIndex = window.sessionStorage.getItem('curTimeIndex')
        let end = new Date().getTime()
        if (Number(curTimeIndex) === 999) return
        if (curTimeIndex == null) {
          window.sessionStorage.setItem('curTimeIndex', 0)
          curTimeIndex = 0
        }
        let start = this.countStartTime(curTimeIndex)
        this.$root.eventBus.setCurTime([start, end])
      }
    }
  }
</script>
