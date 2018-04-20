<style lang="scss" scoped>
@import "~vars";
.left-menu {
  width: 100%;
  ul {
    max-height: 100%;
    li {
      float: left;
      width: 100%;
      height: 40px;
      a {
        width: 100%;
        height: 40px;
        display: block;
        font-size: $font-size-base;
        text-align: left;
        padding: 7px 10px 7px 24px;
        box-sizing: border-box;
        .icon {
          float: left;
          text-align: center;
          display: block;
          font-size: $font-icon-size-large;
        }
        .text {
          height: 26px;
          line-height: 26px;
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
  }
  ul.mini {
    li {
      a {
        .text {
          display: none;
        }
      }
    }
  }
  .icon-container {
    width: 20px;
    text-align: center;
  }
}
</style>

<template>
  <div class="left-menu">
    <ul :class="type">
      <li class="theme-font-color-base"
        v-for="item in menuData"
        :key="item.link"
        :class="{ 'theme-font-color-normal-1 theme-background-color-normal-2': activeCondition(item.pathName) }">
        <el-tooltip effect="dark" :content="item.name" placement="right" :manual='tooltipManual' transition="el-fade-in" popper-class="theme-background-color-normal-3">
          <router-link :to="{name: item.pathName}">
            <span class="icon-container icon">
              <i class="theme-font-icon-color-weak" :class="item.iconName"></i>
            </span>
            <div class="text">{{item.name}}</div>
          </router-link>
        </el-tooltip>
      </li>
      <!-- <router-link
        tag="li"
        v-for="item in menuData"
        :key="item.pathName"
        class="theme-font-color-weak"
        active-class="theme-font-color-normal-1 theme-background-color-primary"
        :to="{name: item.pathName}">
        <i :class="'icon '+item.iconName"></i>
        {{item.name}}
      </router-link>
      -->
    </ul>
  </div>
</template>
<script>
import menuData from './left-menu-data.js' // mock的菜单数据
import { Button, Tooltip } from 'element-ui'
export default {
  components: {
    'el-button': Button,
    'el-tooltip': Tooltip
  },
  props: ['type'],
  data() {
    return {
      menuData: [],
      classType: '',
      tooltipManual: true
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(v) {
        this.setMenuData()
      }
    },
    type: {
      deep: true,
      handler(v) {
        if (v === 'mini') {
          this.tooltipManual = false
        } else {
          this.tooltipManual = true
        }
      }
    }
  },
  mounted: function() {
    this.setMenuData()
    this.tooltipShow(this.type)
  },
  methods: {
    tooltipShow(type) {
      if (type === 'mini') {
        this.tooltipManual = false
      } else {
        this.tooltipManual = true
      }
    },
    setMenuData() {
      // console.log(this.$route)
      this.menuData = menuData.application
      // 下面的逻辑暂时废弃，以后可能还会打开
      //        if (/(overview)|\//.test(this.$route.path)) {
      //          this.menuData = menuData.overview;
      //        }
      //        if (/application/.test(this.$route.path)) {
      //          this.menuData = menuData.application;
      //        }
      //        if (/settings/.test(this.$route.path)) {
      //          this.menuData = menuData.settings;
      //        }
    },
    activeCondition(pathName) {
      return this.$route.path.split('/')[2] === pathName
    }
  }
}
</script>

