/*
 * @Author: AnThen
 * @Date: 2017-08-11 18:35:24
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-30 16:29:54
 */
<style lang="scss" scoped>
@import '~mixin';
  .main-menu{
    float: left;
    width: 60px;
    height: 100%;
    .ul{float: left; width: 100%; height: 100%;
      .li{float: left; width: 100%; height: 25%; cursor: pointer; padding: 1px 0; border-top:1px solid rgba(51,51,51,1); border-bottom:1px solid rgba(51,51,51,1);
        .box{width: 100%; height: 100%;
          @include flex-display; @include flex-center; @include flex-direction(column);
          .icon{width: 36px; height: 36px; border-radius: 50%; color: rgba(153, 153, 153, 1); font-size: 22px;}
          .item{width: 30px; margin-top: 6px;
            .name{float: left; width: 16px; font-size: 14px; line-height: 18px; color: rgba(153, 153, 153, 1); writing-mode: tb-rl; letter-spacing: 4px;}
            .lable{float: right; width: 12px; line-height: 9px; color: rgba(153, 153, 153, 0.5); writing-mode: tb-rl;}
          }
        }
      }
      .li:first-child{border-top: none;}
      .li:last-child{border-bottom: none;}
      .li:hover{background-color: rgba(0, 121, 107, 0.2); border-top-color: rgba(0, 121, 107, 0.2); border-bottom-color: rgba(0, 121, 107, 0.2);
        .box{background-color: rgba(0, 121, 107, 0.2);}
      }
      .li.hover{background-color: rgba(0, 150, 136, 0.8); border: none;
        .box{background-color: rgba(0, 69, 62, 1);
          .icon{border: 1px solid rgba(0, 121, 107, 1); background-color: rgba(0,0,0,0.3); color: rgba(255, 255, 255, 1);}
          .item{
            .name{color: rgba(255, 255, 255, 1);}
            .lable{color: rgba(0, 150, 136, 1);}
          }
        }
      }
    }
  }
</style>
<template>
  <div class="main-menu">
    <ul class="ul">
      <li class="li"
      :class="overview.hover"
      v-if="overview.show"
      @click="menuLink('overview')">
        <div class="box">
          <i class="icon fa" :class="overview.icon"></i>
          <div class="item">
            <div class="name">{{overview.name}}</div>
            <div class="lable">{{overview.lable}}</div>
          </div>
        </div>
      </li>
      <li class="li"
      :class="journey.hover"
      v-if="journey.show"
      @click="menuLink('journey')">
        <div class="box">
          <i class="icon fa" :class="journey.icon"></i>
          <div class="item">
            <div class="name">{{journey.name}}</div>
            <div class="lable">{{journey.lable}}</div>
          </div>
        </div>
      </li>
      <li class="li"
      :class="assets.hover"
      v-if="assets.show"
      @click="menuLink('assets')">
        <div class="box">
          <i class="icon fa" :class="assets.icon"></i>
          <div class="item">
            <div class="name">{{assets.name}}</div>
            <div class="lable">{{assets.lable}}</div>
          </div>
        </div>
      </li>
      <li class="li"
      :class="enhancement.hover"
      v-if="enhancement.show"
      @click="menuLink('enhancement')">
        <div class="box">
          <i class="icon fa" :class="enhancement.icon"></i>
          <div class="item">
            <div class="name">{{enhancement.name}}</div>
            <div class="lable">{{enhancement.lable}}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'main-menu',
  data () {
    return {
      overview: {
        icon: 'fa-tachometer',
        name: '数据概览',
        lable: 'Data Overview',
        hover: '',
        show: true
      },
      journey: {
        icon: 'fa-paper-plane',
        name: '客户旅程',
        lable: 'Customer Journey',
        hover: '',
        show: true
      },
      assets: {
        icon: 'fa-pie-chart',
        name: '客户资产',
        lable: 'Customer Assets',
        hover: '',
        show: true
      },
      enhancement: {
        icon: 'fa-line-chart',
        name: '营销增强',
        lable: 'Marketing Enhancement',
        hover: '',
        show: true
      }
    }
  },
  mounted () {
    this.journey.hover = 'hover'
  },
  watch: {
    overview: {
      deep: true,
      handler (val) {
        this.watchMenu(val)
      }
    },
    journey: {
      deep: true,
      handler (val) {
        this.watchMenu(val)
      }
    },
    assets: {
      deep: true,
      handler (val) {
        this.watchMenu(val)
      }
    },
    enhancement: {
      deep: true,
      handler (val) {
        this.watchMenu(val)
      }
    }
  },
  methods: {
    watchMenu (val) {
      if (val.hover) {
        this.$emit("watchMainMenu",val)
      }
    },
    menuLink (val) {
      /*
      this.overview.hover = ''
      this.journey.hover = ''
      this.assets.hover = ''
      this.enhancement.hover = ''
      switch (val) {
        case 'overview':
        this.overview.hover = 'hover'
        break
        case 'journey':
        this.journey.hover = 'hover'
        break
        case 'assets':
        this.assets.hover = 'hover'
        break
        case 'enhancement':
        this.enhancement.hover = 'hover'
        break
      }
      this.$router.push({
        path: '/'+val
      })
      */
    }
  }
}
</script>

