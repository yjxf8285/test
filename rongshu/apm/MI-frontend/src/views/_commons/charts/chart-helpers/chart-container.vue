<style lang="scss" scoped>
  @import '~vars';
  .chart-container {
    position: relative;
    height: 100%;
  }
  .chart-container-box {
    position: relative;
    height: 350px;
    // border: 1px solid;
    border-width: 1px;
    border-style: solid;
    // margin-bottom: 16px;
    // border-radius: $border-radius-base;
  }
  .chart-content {
    height: 326px;
  }
  .chart-title {
    width: 100%;
    height: 32px;
    padding: 0 16px;
    box-sizing: border-box;
    line-height: 32px;
    font-size: $normal;
    border-left-width: 4px;
    border-left-style: solid;
    margin-top: 10px;
  }
  .chart-content {
    position: relative;
    top: -36px;
  }
  .chart-placeholder {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 300px;
    line-height: 264px;
    text-align: center;
    font-size: $small;
  }
  .chart-container-big {
    height: 600px;
    .chart-content,
    .chart-placeholder {
      height: 564px;
    }
    .chart-placeholder {
      line-height: 564px;
    }
  }
</style>
<template>
  <div class="chart-container au-theme-radius">
    <div v-if="!isAutoHeight" class="chart-container-box au-theme-border-color--base-8" :class="{'chart-container-big': isBig}">
      <div class="chart-title au-theme-border-color--primary-3">{{ title }}</div>
      <div class="chart-placeholder au-theme-background-color--base-12" v-show="isEmpty && !isLoading">
        <!-- <i class="icon ion-alert-circled theme-font-color-primary"></i> -->
        <span class="au-theme-font-color--base-7">暂无数据</span>
      </div>
      <div class="chart-content">
        <slot v-show="!isEmpty"></slot>
      </div>
    </div>
    <chart-auto-height-container v-if="isAutoHeight" :title="title" :isLoading="isLoading" :isEmpty="isEmpty">
      <slot v-show="!isEmpty"></slot>
    </chart-auto-height-container>
  </div>
</template>
<script>
import chartAutoHeightContainer from './chart-auto-height-container'

export default {
  components: {chartAutoHeightContainer},
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
    },
    isAutoHeight: false
  }
}
</script>
