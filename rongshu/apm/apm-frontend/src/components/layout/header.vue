<style lang="scss" scoped>
@import "~vars";

.top-menu-btn {
  padding: 2px 21px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #2879ff;
}

.header:after {
  content: "";
  display: block;
  clear: both;
}

.header {
  height: $headerHeight;
  border-bottom: solid 1px;
  a,
  a:hover {
    font-weight: 300;
    text-decoration: none;
  }

  .top-menu {
    float: left;
    height: $headerHeight;
    margin-left:24px;
    li {
      float: left;
      margin-right: 24px;
      line-height: $headerHeight;
      .icon {
        font-size: $font-icon-size-large;
        vertical-align: middle;
        margin-right: 8px;
      }
    }
  }
  .user-profile {
    float: right; //display: none;
    height: $headerHeight;

    > li {
      position: relative;
      font-size: $font-size-large;
      float: left;
      height: $headerHeight;
      line-height: $headerHeight;
      transition: color 0.1s;
      margin-right: 16px;
      > a {
        display: block;
        width: 80px;
        height: 56px;
        text-align: center;
        line-height: 54px;
        &:hover {
          background: #2879ff;
        }
      }
      .icon {
        font-size: $font-icon-size-base;
        margin-right: 5px;
        transition: color 0.1s;
        vertical-align: middle;
      }
      .alarm-btn {
        font-size: $font-icon-size-large;
      }

      .user-unlist {
        position: absolute;
        top: 55px;
        left: 0;
        background: #333;
        color: #fff;
        z-index: 99;
        transition: 0.25s all;
        > li {
          cursor: pointer;
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
  }
}
</style>

<template>
  <div class="header theme-border-color-darken theme-background-color-base">

    <ul class="top-menu">
      <li>
        <router-link to="/">
          <el-button type="primary" size="small" class="top-menu-btn">
            <i class="icon ion-android-apps"></i><span style="font-size: 12px;">应用</span>
          </el-button>
        </router-link>
      </li>
      <li class="theme-font-color-base fn-hide" v-if="showSetBtn"
          :class="{ 'theme-font-color-primary': $route.path.indexOf('/settings') !== -1 }">
        <router-link to="/settings">
          <i class="icon ion-android-settings"></i>设置
        </router-link>
      </li>
      <li class="theme-font-color-strong fn-hide" :class="{ 'theme-font-color-primary': false}">
        <a :href="portalUrl" target="_blank" @click="getPortalUrl">
          <i class="icon ion-qr-scanner"></i>大屏</a>
      </li>
    </ul>
    <ul class="user-profile">
      <li>
        <a :href="alarmUrl">
          <au-icon type="bell" class="alarm-btn theme-font-color-normal-1"
                   style="font-size:18px;vertical-align: middle;"></au-icon>
        </a>
      </li>
      <li class="user-profile-setting"  @mouseleave="showLogout=false">
        <a href="javascript:;"
           @mouseenter="showLogout=true"
        >
          <au-icon type="user-circle" class="alarm-btn theme-font-color-normal-1"
                   style="font-size:18px;vertical-align: middle;"></au-icon>
        </a>
        <ul class="user-unlist"  v-show="showLogout" >
          <li @click="logOut"> 退出 </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { Button, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
export default {
  name: 'app-header',
  components: {
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem
  },
  data() {
    return {
      showLogout: false,
      logoUrl: window.$$apm.logoUrl,
      showSetBtn: true,
      userName: '',
      alarmUrl: '',
      grafanaLoginUrl: window.$$apm.grafanaLoginUrl,
      grafanafullScreenUrl: window.$$apm.grafanafullScreenUrl,
      systemId: '',
      timerId: ''
    }
  },
  mounted() {
    let vm = this
    vm.api.config().then(function(responseData) {
      vm.alarmUrl =
        responseData.data.alarmHost + '?token=' + responseData.data.token
    })
  },
  computed: {
    portalUrl() {
      return '/sysinfo?systemId=' + this.systemId + '&interval=' + this.timerId
    }
  },
  methods: {
    login() {
      this.$router.push({
        name: 'login',
        query: {
          redirectUrl: encodeURIComponent(window.location.href)
        }
      })
    },
    getCurrentConfig() {
      this.api.getUserConfig().then(function(responseData) {
        this.userName = responseData.userName
      })
    },
    logOut() {
      let that = this
      that.api.logout().then(result => {
        if (result.success) {
        }
        that.login()
      })
    },
    onIframeLoaded() {
      console.log('loaded')
    },
    getPortalUrl() {
      this.systemId = this.$root.eventBus.getCurSystem().id
      this.timerId = this.$root.eventBus.getCurTime().id
      console.log(this.systemId)
      console.log(this.timerId)
    }
  }
}
</script>

