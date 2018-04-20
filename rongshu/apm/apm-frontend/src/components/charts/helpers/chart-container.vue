<style lang="scss" scoped>
@import "~vars";
.chart-container {
  position: relative;
  border: 0px solid;
  margin-bottom: 16px;
  border-radius: $border-radius-base;
  width: 100%;
  height: 100%;
}
.chart-title {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: #666 !important;
  .title-icon {
    font-size: 18px;
    margin-right: 12px;
  }
}
.chart-placeholder {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  text-align: center;
  span {
    position: absolute;
    top: 50%;
    margin-top: -7px;
  }
}
.chart-header-hide {
  display: none;
}
.chart-border-hide {
  border: 0px;
}
</style>
<template>
    <div
      class="chart-container theme-backgroung-color-white theme-border-color-base"
      :class="{'chart-border-hide': !showBorder}"
      :style="{height: height + 'px'}">
      <div
        class="chart-title theme-font-color-base theme-background-color-normal"
        :class="{'chart-header-hide': !showHeader}"
        :style="{height: headerHeight + 'px' ,lineHeight: headerHeight + 'px' }">
        <i class="title-icon icon ion-podium"></i>
        {{ title }}
      </div>
      <div
        v-show="isEmpty && !isLoading"
        class="chart-placeholder theme-background-color-normal-1"
        :style="{height: (showHeader ? (height - headerHeight) : height) +'px'}">
        <span class="theme-font-color-weaken">暂无数据</span>
      </div>
      <div
        class="chart-content"
        v-show="!isEmpty"
        :style="{height: (showHeader ? (height - headerHeight) : height) +'px'}"
        >
        <slot></slot>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      headerHeight: 50
    }
  },
  props: {
    showBorder: {
      required: false,
      default: false
    },
    showHeader: {
      required: false,
      default: false
    },
    title: {
      default: ''
    },
    isEmpty: {
      default: true
    },
    isLoading: {
      default: false
    },
    height: {
      default: 350,
      required: false
    }
  }
}
</script>
