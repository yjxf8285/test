<style lang="scss" scoped>
@import "~vars";
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid;
  border-radius: $border-radius-base;
}
.chart-content,
.chart-placeholder {
  position: absolute;
  width: 100%;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;
}
.chart-title {
  width: 100%;
  height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
  line-height: 32px;
  font-size: $font-size-base;
}
.chart-placeholder {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
}
.chart-placeholder-text {
  display: block;
  position: absolute;
  width: 100%;
  height: 14px;
  top: 50%;
  margin-top: -7px;
  text-align: center;
}
</style>
<template>
  <div class="chart-container theme-backgroung-color-white theme-border-color-base" :class="{'chart-container-big': isBig}">
    <div class="chart-title theme-font-color-base theme-background-color-lighten">{{ title }}</div>
    <div class="chart-content">
      <div class="chart-placeholder theme-background-color-normal-1" v-show="isEmpty && !isLoading">
        <!-- <i class="icon ion-alert-circled theme-font-color-primary"></i> -->
        <span class="theme-font-color-weaken chart-placeholder-text">暂无数据</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      default: ''
    },
    isEmpty: {
      default: true
    },
    isBig: {
      default: false
    },
    isLoading: {
      default: false
    }
  }
}
</script>
