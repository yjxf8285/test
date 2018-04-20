<style lang="scss" scoped>
@import "~vars";
  html, body {
    font-family: $fontFamily;
  }
  .mobile-apm {
    width: 100%;
    height: 100%;
  }
  .main {
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .header:after {
    content: "";
    display: block;
    clear: both;
  }
  .header {
    overflow: hidden;
    height: 40px;
    font-size: $normal;
    a {
      text-decoration: none;
    }
    .logo {
      float: left;
      width: 260px;
      height: 40px;
      padding-left: 20px;
      line-height: 40px;

      // text-align: center;
      // font-weight: bold;
    }
    .top-menu {
      float: left;
      height: 40px;
      li {
        float: left;
        height: 40px;
        line-height: 40px;
        .icon {
          font-size: 20px;
          margin-right: 10px;
          transition: color .1s;
          vertical-align: middle;
        }
        a {
          padding: 0 24px;
          height:40px;
          display: inline-block;
          line-height: 40px;
        }
      }
    }
    .user-profile {
      float: right;
      height: 40px;
      li {
        float: left;
        height: 40px;
        line-height: 40px;
        transition: color .1s;
        margin-right: 16px;
        .icon {
          font-size: 14px;
          margin-right: 5px;
          transition: color .1s;
          vertical-align: middle;
        }
        .alarm {
          font-size: 14px;
        }
      }
    }
  }
</style>
<template>
  <div class="mobile-apm au-theme-background-color--base-12">
    <div class="header au-theme-background-color--base-1">
      <div class="logo au-theme-background-color--base-2 au-theme-font-color--base-12">Mobile APM</div>
      <ul class="top-menu">
        <li class="au-theme-font-color--base-12">
          <a class="au-theme-font-color--base-12" href="/">
            <span>应用</span>
          </a>
        </li>
        <li class="au-theme-font-color--base-12">
          <a class="au-theme-font-color--base-12" href="/">
            <span>关键事务</span>
          </a>
        </li>
        <li class="au-theme-font-color--base-12 au-theme-background-color--primary-3">
          <router-link :to="{ name: 'application-list' }" class="au-theme-font-color--base-12" href="/">
            <span>移动</span>
          </router-link>
        </li>
        <li class="au-theme-font-color--base-12">
          <a class="au-theme-font-color--base-12" href="/">
            <span>告警</span>
          </a>
        </li>
        <li class="au-theme-font-color--base-12">
          <a class="au-theme-font-color--base-12" href="/">
            <span>大屏</span>
          </a>
        </li>
      </ul>
      <ul class="user-profile">
        <li class="au-theme-font-color--base-12" :class="{ 'theme-font-color-primary': false }">
          <a href="javascript:void(0);" class="au-theme-font-color--base-12" >
            <i class="icon ion-android-person"></i>{{ 'User Name' }}</a>
        </li>
        <li class="au-theme-font-color--base-12" :class="{ 'theme-font-color-primary': false }">
          <a href="javascript:void(0);" class="au-theme-font-color--base-12"  @click="logout">
            <i class="icon ion-power"></i>退出</a>
        </li>
      </ul>
    </div>
    <div class="main theme-background-color-base">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'mobile-apm',
    methods: {
      logout () {}
    }
  }
</script>
