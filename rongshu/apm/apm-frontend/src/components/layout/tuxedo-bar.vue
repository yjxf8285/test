<style lang="scss" scoped>
@import "~vars";
.tuxedo-bar {
  margin: $marginWidth;
  .tabs {
    background: #fff;
    box-shadow: 0 0 1px rgba(60, 65, 71, 0.5);
  }
}
.tuxedo-bar-query {
  // text-align: right;
  height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid;
  .submit {
    width: 100px;
    float: right;
  }
  .query {
    position: relative;
    float: right;
  }
  .time-selector {
    margin-left: 8px;
  }
  .el-dropdown-menu {
    max-height: 400px;
    overflow-y: auto;
  }
}
.tuxedo-bar-query:after {
  content: "";
  display: block;
  clear: both;
}
.tab-list:after {
  content: "";
  display: block;
  clear: both;
}
.tab-list {
  height: 40px;
  padding: 0 10px;
  li {
    float: left;
    height: 100%;
    a {
      position: relative;
      bottom: -1px;
      display: block;
      height: 100%;
      box-sizing: border-box;
      line-height: 40px;
      padding: 0 20px;
      font-size: $font-size-large;
    }
    a:hover,
    a.active {
      border-bottom: 2px solid #2879ff !important;
    }
  }
}
</style>
<template>
  <div class="tuxedo-bar">
    <div class="tabs" v-show="$route.query.tierId" >
      <ul class="tab-list">
        <li><router-link
          active-class="active theme-border-color-primary theme-font-color-primary"
          class="theme-font-color-weak" :to="{name: 'tier-tuxedo-current', query: $route.query}">实时</router-link></li>
        <li><router-link
          active-class="active theme-border-color-primary theme-font-color-primary"
          class="theme-font-color-weak" :to="{name: 'tier-tuxedo-server', query: $route.query}">服务器</router-link></li>
        <li><router-link
          active-class="active theme-border-color-primary theme-font-color-primary"
          class="theme-font-color-weak" :to="{name: 'tier-tuxedo-client', query: $route.query}">客户端</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tuxedo-bar'
}
</script>
