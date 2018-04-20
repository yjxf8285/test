<style lang="scss" scoped>
@import "~vars";
.content {
  margin-top: 0px;
}
.tabs {
  border-bottom: solid 1px #dcdcdc;
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
      border-bottom: 2px solid #2879ff;
    }
  }
}
</style>

<template>
  <div>
    <top-bar title="设置" pureTitle="true" @barChange="barChange"></top-bar>
    <div class="common-container tabstyle">
      <div class="tabs">
        <ul class="tab-list">
          <li>
            <router-link
              active-class="active theme-border-color-primary theme-font-color-primary"
              class="theme-font-color-weak" :class="{
                'active': $route.name === 'tier-list-setting' || $route.name === 'instance-list-setting'
              }" :to="{name: 'tier-list-setting'}">探针设置
            </router-link>
          </li>
          <li>
            <router-link
              active-class="active theme-border-color-primary theme-font-color-primary"
              class="theme-font-color-weak" :to="{name: 'regular-setting'}">规则设置
            </router-link>
          </li>
          <li>
            <router-link
              active-class="active theme-border-color-primary theme-font-color-primary"
              class="theme-font-color-weak" :to="{name: 'web-probe-setting'}">Web探针
            </router-link>
          </li>
        </ul>
      </div>
      <slot>
      </slot>
    </div>
  </div>
</template>
<script>
import topBarQuery from '_components/mixin/topBarQuery'
export default {
  name: 'settings',
  mixins: [topBarQuery],
  methods: {
    barChange(queryData) {
      console.log(queryData)
      this.topBarQueryData = queryData
      this.$emit('onContainerLoaded', this.topBarQueryData)
    }
  }
}
</script>
