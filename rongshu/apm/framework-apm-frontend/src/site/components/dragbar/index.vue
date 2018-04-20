<style lang="scss" scoped>
  @import "~vars";
  .slider {
    padding: 0 10px;
    .bar {
      position: relative;
      width: 100%;
      height: 6px;
      box-sizing: border-box;
      border-radius: 19px;
      // overflow: hidden;
      z-index: 2;
    }
    .highlight {
      position: relative;
      width: 50%;
      height: 100%;
      border-top-left-radius: 19px;
      border-bottom-left-radius: 19px;
    }
    .grip {
      position: absolute;
      top: -10px;
      right: -12px;
      width: 24px;
      height: 24px;
      border-radius: 100%;
      border-width: 2px;
      border-style: solid;
      cursor: grab;
    }
    .grip.dragging {
      cursor: grabbing;
    }
    .scale {
      position: relative;
      z-index: 0;
      margin-top: 10px;
      height: 26px;
      font-size: $small;
      li {
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
        line-height: 8px;
      }
    }
    .scale-item {
      margin-top: 5px;
      height: 8px;
      // line-height: 16px;
      text-align: center;
    }
    .scale-line {
      display: inline-block;
      width: 0;
      height: 8px;
      border-left-width: 1px;
      border-left-style: solid;
    }
  }
</style>
<template>
  <div class="slider">
    <div class="bar au-theme-background-color--base-10" ref="bar">
      <div
        class="highlight au-theme-background-color--primary-3"
        :style="{
          width: barHighlightWidth
        }">
        <div
          class="grip au-theme-background-color--base-12 au-theme-border-color--primary-3"
          :class="{
            dragging: isDragging
          }"
          @mousedown="handleMousedown"
          ref="grip"></div>
      </div>
    </div>
    <ul class="scale" v-show="showScale" ref="scale">
      <li v-for="(point, index) in points" :key="index">
        <span class="scale-line au-theme-border-color--base-8"></span>
        <div class="scale-item"
          :class="{
            'au-theme-font-color--base-7': point > index + 1,
            'au-theme-font-color--primary-3': point <= index + 1
          }">
          {{ point }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    name: 'slider',
    mounted() {
      this.putScale()
      this.barHighlightWidth = this.fix(this.localValue / (this.points.length - 1) * 100)
      window.addEventListener('mousemove', this.handleMousemove)
      window.addEventListener('mouseup', this.handleMouseup)
    },
    destroyed() {
      window.removeEventListener('mousemove', this.handleMousemove)
      window.removeEventListener('mouseup', this.handleMouseup)
    },
    data() {
      return {
        localValue: this.value,
        isDragging: false,
        draggingStartX: 0,
        barHighlightWidth: 0
      }
    },
    props: {
      scale: {
        type: Array
      },
      step: {
        type: Number,
        default: 1
      },
      showScale: {
        type: Boolean,
        default: true
      },
      value: {
        type: [Number, String],
        required: true
      }
    },
    computed: {
      points() {
        let res = []
        let times = this.scale && this.scale.length ? this.scale.length / this.step : 10
        for (let i = 0; i < times; i++) {
          res.push(this.scale && this.scale.length ? this.scale[i] : i + 1)
        }
        return res
      }
    },
    watch: {
      localValue(v) {
        this.$emit('input', this.points[v], v)
        this.barHighlightWidth = this.fix(this.localValue / (this.points.length - 1) * 100)
      },
      value(v) {
        if (v !== this.localValue) this.localValue = v
      }
    },
    methods: {
      putScale() {
        let lis = this.$refs.scale.querySelectorAll('li')
        let scaleWidth = this.$refs.scale.getBoundingClientRect().width
        Array.prototype.forEach.call(lis, (li, index) => {
          let width = li.getBoundingClientRect().width
          let res = scaleWidth / (this.points.length - 1) * index - width / 2
          res = index === 0 ? res + 2 : index === this.points.length - 1 ? res - 2 : res // fix
          li.style.left = res + 'px'
        })
      },
      handleMousedown(e) {
        this.isDragging = true
        this.draggingStartX = e.pageX
      },
      handleMousemove(e) {
        if (!this.isDragging) return
        e.preventDefault()
        let { left, width } = this.$refs.bar.getBoundingClientRect()
        let stepWidth = width / (this.points.length - 1)
        let res = Math.round((e.pageX - left) / stepWidth)
        this.localValue = res < 0
          ? 0
          : res > this.points.length - 1
            ? this.points.length - 1
            : res
      },
      handleMouseup() {
        if (!this.isDragging) return
        this.isDragging = false
        this.$emit('change', this.points[this.localValue], this.localValue)
      },
      fix(value) {
        return value <= 0
          ? '2px'
          : value >= 100
            ? this.$refs.bar.getBoundingClientRect().width - 2 + 'px'
            : value + '%'
      }
    }
  }
</script>
