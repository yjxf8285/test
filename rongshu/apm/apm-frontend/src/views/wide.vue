<style lang="scss">
@import "../assets/css/index";
@import "../assets/css/ionicons/ionicons.css";
@import "~vars";

.con {
  // position: absolute;
  background: #ebebeb;
  top: 41px;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  .banner {
    z-index: 999;
    width: 100%;
  }
}
</style>
<template>
  <div id="app" class="app theme-font-color-base">
    <div class="banner">
      <apm-header></apm-header>
    </div>
    <div class="con ">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import apmHeader from '../components/layout/header.vue'
export default {
  name: 'app',
  components: { apmHeader },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

