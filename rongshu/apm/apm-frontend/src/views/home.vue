<style lang="scss">
  @import "../assets/css/index";
  @import "../assets/css/ionicons/ionicons.css";
  @import "~vars";

  .app {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .logo {
    width: 100%;

    height: $headerHeight;
    margin-right: $marginWidth;

  }

  .main {
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .main:after {
    content: "";
    display: block;
    clear: both;
  }

  .left-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: $leftWidth;
    &.mini{
      img{
        display: none;
      }
    }
    .left-system {
      height: 50px;
    }
    .left-hr {
      width: 100%;
      padding: 0;
      box-sizing: border-box;
      .border-top {
        width: 100%;
        height: 5px;
        border-top: 1px solid;
      }
    }
    .left-menu {
      overflow-y: auto;
    }
    .left-show {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 39px;
      box-sizing: border-box;
      padding: 0;
      cursor: pointer;
      .icon-box {
        width: 100%;
        height: 100%;
        text-align: right;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-top: 1px solid;
        padding-right: 10px;
        box-sizing: border-box;
      }
    }
  }

  .left-content.mini {
    width: 66px;
    .left-show {
      .icon-box {
        padding-right: 0;
        justify-content: center;
      }
    }
  }

  .main-content {
    position: absolute;
    left: $leftWidth;
    top: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
  }

  .main-content.mini {
    left: 66px;
  }

  .banner {
    z-index: 999;
    width: 100%;
  }

  .main-content-container {
    position: absolute;
    left: 0;
    top: 56px;
    right: 0;
    bottom: 0;
    padding-top:24px;
    overflow: auto;
    width: 100%;
    min-width: 860px;
    box-sizing: border-box;
    background-color: #f7f7f7;
    border-left: solid 1px #dcdcdc;
  }
</style>
<template>
  <div id="app" class="app theme-font-color-base">

    <div class="main">
      <div class="left-content theme-background-color-normal-1" :class="left.className">
        <div class="logo theme-background-color-darken">
          <img :src="'/static/images/' +logoUrl+'.png'" style="margin-top: 8px;" alt="">
          <!--<img :src="'/static/images/logo_cdsb.png'" style="margin-top: 8px;" alt="">-->
        </div>
        <div class="left-system">
          <system-selector :isPackUp="ssPackUp"></system-selector>
        </div>
        <div class="left-hr">
          <div class="border-top theme-border-color-base"></div>
        </div>
        <left-menu class="left-menu" :type="left.className"></left-menu>
        <div class="left-show" @click="miniAction">
          <div class="icon-box theme-border-color-base">
            <i class="theme-font-icon-color-weak icon" :class="left.iconName"></i>
          </div>
        </div>
      </div>
      <div class="main-content theme-background-color-normal-1" :class="left.className">
        <apmHeader></apmHeader>
        <div class="main-content-container" ref="mainContentContainer">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <snapshot></snapshot>
  </div>
</template>
<script>
  import systemSelector from '../components/layout/system-selector.vue'
  import apmHeader from '../components/layout/header.vue'
  import leftMenu from '../components/layout/left-menu.vue'
  import Snapshot from './snapshot.vue'

  export default {
    name: 'home',
    components: {apmHeader, leftMenu, systemSelector, Snapshot},

    data() {
      return {
        logoUrl: window.$$apm.logoUrl,
        left: {
          className: '',
          iconName: 'ion-chevron-left'
        },
        ssPackUp: false, // 是否收起
        leftMenu: [],
        lazyCharts: {},
        mainContentContainer: {
          height: 0,
          top: 0,
          scrollTop: 0
        }
      }
    },
    created() {
      let vm = this
      vm.fetchMenuType()
      vm.$root.eventBus.$on('add-lazyload-component', vm.initLazyCharts)
      $(window).on('resize', () => { vm.resize() })
    },
    mounted() {
      let vm = this
      vm.resize()
      $(vm.$refs.mainContentContainer).on('scroll', () => { vm.onScroll() })
      vm.onScroll()
    },
    methods: {
      resize() {
        this.mainContentContainer.top = $(this.$refs.mainContentContainer).offset().top
        this.mainContentContainer.scrollTop = $(this.$refs.mainContentContainer).scrollTop()
        this.mainContentContainer.height = $(this.$refs.mainContentContainer).height()
      },
      fetchMenuType() {
        let leftMenuType = localStorage.getItem('leftMenuType')
        if (leftMenuType) {
          this.left = {
            className: leftMenuType,
            iconName: 'ion-chevron-right'
          }
          this.ssPackUp = true
        } else {
          this.left = {
            className: '',
            iconName: 'ion-chevron-left'
          }
          this.ssPackUp = false
        }
      },
      miniAction() {
        if (this.left.className === 'mini') {
          localStorage.setItem('leftMenuType', '')
          this.left = {
            className: '',
            iconName: 'ion-chevron-left'
          }
          this.ssPackUp = true
        } else {
          localStorage.setItem('leftMenuType', 'mini')
          this.left = {
            className: 'mini',
            iconName: 'ion-chevron-right'
          }
          this.ssPackUp = false
        }
        this.ssPackUp = !this.ssPackUp
      },
      onScroll() {
        let vm = this
        vm.mainContentContainer.scrollTop = $(vm.$refs.mainContentContainer).scrollTop()
        Object.keys(vm.lazyCharts).forEach((chartHeight) => {
          if (chartHeight - vm.mainContentContainer.scrollTop < vm.mainContentContainer.height) {
            vm.lazyCharts[chartHeight].lazyLoad && vm.lazyCharts[chartHeight].lazyLoad()
          }
        })
      },
      initLazyCharts(component) {
        let offset = $(component.$refs.chart).offset()
        this.lazyCharts[offset.top - this.mainContentContainer.top] = component
      }
    }
  }
</script>

