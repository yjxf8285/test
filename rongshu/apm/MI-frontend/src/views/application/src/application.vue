<style lang="scss" scoped>
  .application {
    width: 100%;
    height: 100%;
    .sidebar {
      position: relative;
      float: left;
      // width: 260px;
      height: 100%;
      padding-top: 40px;
      border-right-width: 1px;
      border-right-style: solid;
    }
    .menu {
      width: 260px;
    }
    .content {
      position: relative;
      height: 100%;
      padding-top: 40px;
      overflow-x: auto;
    }
    .app-selector {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .toolbar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px 0 100px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
    }
    .breadcrumbs {
      position: absolute;
      top: 0;
      left: 20px;
      vertical-align: middle;
      height: 40px;
      line-height: 40px;
    }
    .tools {
      float: left;
      height: 39px;
      line-height: 33px;
      width: 100%;
      vertical-align: middle;
      padding-top: 3px;
      text-align: right;
      // float: right;
    }
    .version-selector,
    .refresh-btn,
    .time-picker {
      vertical-align: middle;
    }
    .refresh-btn,
    .time-picker {
      position: relative;
      top: -2px;
      margin-left: 5px;
    }
    .time-picker {

    }
    .router-view-container {
      height: 100%;
    }
  }
</style>

<template>
  <div class="application">
    <div class="sidebar au-theme-border-color--base-8">
      <application-selector class="app-selector" :collapse="menuCollapse"/>
      <au-menu class="menu" :items="menuItems" collapse-handlebar-position="bottom" @toggle="v => menuCollapse = v" @select="handleMenuSelect"/>
    </div>
    <div class="content" :style="{paddingTop: $route.name !== 'settings' ? '40px' : '0'}">
      <div class="toolbar au-theme-border-color--base-8" v-show="$route.name !== 'settings'">
        <au-breadcrumb class="breadcrumbs" :crumbs="breadcrumbs"/>
        <div class="tools">
          <version-selector class="version-selector" size="small" />
          <au-button class="refresh-btn" plain @click="refresh" size="small">
            <au-icon type="refresh" />
          </au-button>
          <timepicker class="time-picker" size="small"/>
        </div>
      </div>
      <router-view ></router-view>
    </div>
  </div>
</template>
<script>
  import ApplicationSelector from '../../_commons/application-selector'
  import VersionSelector from '../../_commons/version-selector'
  import Timepicker from '../../_commons/timepicker'
  import menuItems from '../../../routes/menu'
  import store from '_store'

  // import eventBus from '../../models/event-bus'

  export default {
    name: 'application',
    components: { ApplicationSelector, VersionSelector, Timepicker },
    mounted () {
      // console.log(this.$route)
      // for (let i = 0; i < this.menuItems.length; i++) {
      //   if (this.$route.name === this.menuItems[i].url) {
      //     this.currentPageName = this.menuItems[i].text
      //   }
      // }
      // store.$on('ready', this.handleStoreReady)
      // store.$on('change', this.handleStoreChange)
    },
    data () {
      return {
        menuItems,
        menuCollapse: false,
        currentPageName: '',
        versions: null
      }
    },
    computed: {
      breadcrumbs () {
        return [{
          text: this.currentPageName
        }]
      }
    },
    watch: {
      menuCollapse (v) {
        var e = document.createEvent('Event')
        e.initEvent('resize', true, true)
        window.dispatchEvent(e)
      }
    },
    methods: {
      handleMenuSelect (item) {
        this.currentPageName = item.text
        this.$router.push({
          name: item.url
        })
      },
      refresh () {
        store.notify()
      },
      handleStoreReady (res) {
        // console.log(res)
      },
      handleStoreChange (res) {
        // console.log('---', res)
      }
    }
  }
</script>

