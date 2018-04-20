<style lang="scss" scoped>
  @import "~vars";
  html, body {
    font-family: $fontFamily;
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
