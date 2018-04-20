<style lang="scss" scoped>
$marginWidth: 16px;
.common-container /deep/ {
  margin: $marginWidth;
  .au-panel-title { padding:10px; }
  .au-panel-title-icon { bottom: -5px; }
  >.content { padding: 10px; }
}
</style>
<template>
  <au-panel :title="title" :icon="titleIcon" class="common-container" ref="defaultContainer">
    <div slot="title-right">
      <slot name="toolbar"></slot>
    </div>
    <div class="content" :style="{width: width, height: height}">
      <slot></slot>
    </div>
  </au-panel>
</template>
<script>
import LazyLoader from '_helpers/lazy-loader'
import {Icon} from 'admin-ui'
export default {
  name: 'default-containaer',
  components: {
    Icon
  },
  data () {
    return {
      lazyloaderInstance: null,
      loaded: false
    }
  },
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '300px'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    titleIcon: {
      type: String,
      default: 'bars'
    },
    lazyloader: {
      type: Object,
      default () {
        return {
          lazy: false,
          loaded: true,
          onload: function () { throw new Error('you must overide `onload` function.') }
        }
      }
    }
  },
  watch: {
    'lazyloader.loaded': {
      handler (v) {
        if (!v) {
          this.lazyload()
        }
      }
    }
  },
  mounted () {
    this.$nextTick(this.lazyload)
  },
  methods: {
    /**
     * 注册为懒加载组件
    */
    lazyload () {
      let vm = this
      if (vm.lazyloader && vm.lazyloader.lazy) {
        // console.log(vm.$refs.defaultContainer)
        vm.lazyloaderInstance = LazyLoader.registerComponent(vm.$refs.defaultContainer.$el, () => {
          if (!vm.lazyloader.loaded) {
            vm.lazyloader.loaded = true
            vm.lazyloader.onload()
          }
        })
      }
    }
  }
}
</script>
