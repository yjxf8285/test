/*
 * @Author: AnThen
 * @Date: 2017-08-11 18:35:28
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-29 11:36:12
 */
<style lang="scss">
@import "./assets/css/_normalize.scss";
@import "./assets/css/icons/css/font-awesome.min.css";
@import "./assets/css/common.scss";
</style>
<style lang="scss" scoped>
.app {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  min-height: 830px;
  left: 0;
  font-family: 'Ebrima', 'Microsoft YaHei', '微软雅黑';
  font-size: 12px;
}
.banner{
  float: left;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background-color: rgba(0,0,0,1)
}
.main{
  position: absolute;
  width: 100%;
  top: 50px;
  bottom: 0;
  .left-banner{
    float: left;
    width: 383px;
    height: 100%;
    background-color: rgba(0,0,0,1);
  }
  .left-banner.no-second-menu{
    width: 60px;
  }
  .main-content{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 383px;
    background-color: rgba(255, 255, 255, 1);
  }
  .main-content.no-second-menu{
    left: 60px;
  }
  .main-content.second-menu{
    left: 80px;
  }
}
.appBackLayer{
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
<template>
  <div id="app" class="app">
    <div class="banner">
      <top-menu></top-menu>
    </div>
    <div class="main">
      <div class="left-banner" :class="secondMenu.className">
        <main-menu
        :userId="userId"
        v-on:watchMainMenu="listenMainMenu"></main-menu>
        <second-menu
        :mainMenu="mainMenu"
        v-if="secondMenu.type"
        v-on:watchSecondMenu="listenSecondMenu"></second-menu>
      </div>
      <div class="main-content" :class="secondMenu.className">
        <router-view></router-view>
      </div>
    </div>
    <div class="appBackLayer" :style="{top: backLayer.top, 'z-index': backLayer.zindex}"></div>
  </div>
</template>

<script>
import topMenu from './components/layout/top-menu.vue'
import mainMenu from './components/layout/main-menu.vue'
import secondMenu from './components/layout/second-menu.vue'
export default {
  name: 'app',
  components: { mainMenu, secondMenu, topMenu },
  data () {
    return {
      userId: '',
      mainMenu: {},
      secondMenu: {
        type: false,
        className: 'no-second-menu'
      },
      backLayer: this.GLOBAL.appBackLayer
    }
  },
  methods: {
    listenMainMenu (val) {
      if (val.name == '数据概览') {
        this.secondMenu = {
          type: false,
          className: 'no-second-menu'
        }
      } else {
        this.secondMenu = {
          type: true,
          className: ''
        }
      }
      this.mainMenu = val
    },
    listenSecondMenu (val) {
      if (val) {
        this.secondMenu.className = ''
      } else {
        this.secondMenu.className = 'second-menu'
      }
    }
  }
}
</script>
