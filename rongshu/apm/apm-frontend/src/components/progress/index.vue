<style lang="scss">
.progress {
  position: relative;
  display: inline-block;
  width: 100%;
  .progress__text {
    position: absolute;
    font-size: 10px;
    margin-left: -15px;
    /* top: -6px; */
  }
  .progress-bar {
    padding: 15px 0px 0px 0px;
  }
  .progress-bar--nopadding {
    padding: 0px 0px 0px 0px;
  }
  .progress-bar__outer {
    background-color: #e6ebf5;
    line-height: 10px;
    height: 10px;
    border-radius: 0px;
  }
  .progress-bar__inner {
    background-color: #409eff;
    line-height: 10px;
    height: 10px;
    border-radius: 0px;
  }
}
</style>

<template>
  <div class="progress" v-if="!(items && items.length > 0)">
    <div class="progress__text" :style="textStyle">
    <slot></slot>
    </div>
    <div class="progress-bar">
      <div class="progress-bar__outer">
        <div class="progress-bar__inner" :style="barStyle">
        </div>
      </div>
    </div>
  </div>
  <div class="progress" v-else>
      <div v-for="(item, index) in items" :key="index" v-if="item.text" class="progress__text" :style="getTextStyle(item)">
        {{item.text}}
      </div>
      <div class="progress-bar" :class="{
        'progress-bar--nopadding': !paddingTop
      }">
        <div class="progress-bar__outer">
          <div v-for="(item, index) in items" :key="index" class="progress-bar__inner" :style="getBarStyle(item)">
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'RangeProgress',
  props: {
    offset: {
      type: Number,
      default: 0
    },
    textClass: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    percentage: {
      type: Number,
      default: 0,
      required: false
    },
    status: {
      type: String
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    paddingTop() {
      let result = false
      this.items.forEach(item => {
        result = result || (item.text && item.text.length > 0)
      })
      return result
    },
    barStyle() {
      return this.getBarStyle()
    },
    textStyle(item) {
      return this.getTextStyle()
    },
    relativeStrokeWidth() {
      return (this.strokeWidth / this.width * 100).toFixed(1)
    },
    stroke() {
      var ret
      switch (this.status) {
        case 'success':
          ret = '#13ce66'
          break
        case 'exception':
          ret = '#ff4949'
          break
        default:
          ret = '#20a0ff'
      }
      return ret
    },
    iconClass() {
      return this.status === 'success'
        ? 'el-icon-circle-check'
        : 'el-icon-circle-cross'
    }
  },
  methods: {
    getBarStyle(item) {
      var style = {}
      style.position = 'absolute'
      if (!item) {
        style.left = this.offset + '%'
        style.width = this.percentage + '%'
      } else {
        style.left = item.offset + '%'
        style.width = item.percentage + '%'
        style.backgroundColor = this.getStroke(item)
      }
      return style
    },
    getTextStyle(item) {
      var style = {}
      if (!item) {
        style.left = this.offset + '%'
      } else {
        style.left = item.offset + '%'
      }
      return style
    },
    getStroke(item) {
      var ret
      var status = item ? item.status : this.status

      switch (status) {
        case 'success':
          ret = '#29ca8e'
          break
        case 'exception':
          ret = '#5b97fb'
          break
        default:
          ret = '#20a0ff'
      }
      return ret
    }
  }
}
</script>
