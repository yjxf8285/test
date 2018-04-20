<style lang="scss" scoped>
@import "~vars";
.dragbar {
  .drag-box{
    height: 45px;
    position: relative;
    // left: 18px;
  }

  .bar{
    width: 100%;
    height: 19px;
    box-sizing: border-box;
    position: absolute;
    z-index: 10;
    top: 22px;
    border-style: solid;
    border-width: 1px;
    border-radius: 19px;
    // overflow: hidden;
  }

  .scrolled-bar{
    position: relative;
    left: -1px;
    top: 0;
    width: 0;
    height: 100%;
    border-top-left-radius: 19px;
    border-bottom-left-radius: 19px;
  }

  .slider{
    width: 16px;
    height: 27px;
    // border-style: solid;
    // border-width: 1px;
    position: absolute;
    left: 0;
    top: 18px;
    text-align: center;
    z-index: 20;
    vertical-align: middle;
    line-height: 25px;
  }

  .drag-label-box{
    height: 45px;
    position: relative;
  }

  .drag-label-box .item{
    position: absolute;
    left: 0;
    top: 0;
    // width: 50px;
    height: 30px;
    text-align: center;
  }

  .line{
    display: inline-block;
    height: 8px;
    border-right-width: 1px;
    border-right-style: solid;
  }

  .item .text{
    font-size: $small;
    text-align: center;
  }

}
</style>

<template>
  <div class="dragbar">
    <div class="drag-box">
      <div class="slider au-theme-border-color--base-8 au-theme-background-color--primary-3 au-theme-radius" ref="slider" @mousedown="onMouseDown($event)"></div>
      <div class="bar au-theme-background-color--base-11 au-theme-border-color--base-8" ref="bar">
        <div class="scrolled-bar au-theme-background-color--primary-5" :style="{width: position * cell + 'px'}"></div>
      </div>
    </div>
    <ul v-if="showLabel" class="drag-label-box scale">
      <li
        v-for="(label, index) in dragLabels"
        class="item"
        :class="{
          'au-theme-font-color--primary-3': position >= index,
          'au-theme-font-color--base-7': position <= index
        }"
        ref="item"
        :style="{left: index == 0 ? '-3px' : (cell * index ) + 'px'}"
        :key="index">
        <div class="line"></div>
        <div class="text">{{label}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default{
  name: 'dragbar',
  data () {
    return {
      dragData: [],
      dragLabels: [],
      position: this.current,
      cell: 0
    }
  },
  props: {
    current: [String, Number],
    data: Array,
    labels: Array,
    start: null,
    end: null,
    range: null,
    interval: {
      default: 1
    },
    sliderType: {
      type: String,
      default: 'image'
    },
    sliderUrl: {
      type: String
      // default: '../../assets/images/slider.png'
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    current (v) {
      if (this.position !== v) this.position = v
    }
  },
  methods: {
    findData (d) {
      let index = -1
      for (let i = 0; i < this.dragData.length; i++) {
        if (d === this.dragData[i]) {
          index = i
          break
        }
      }
      return index
    },
    onMouseDown (e) {
      this.dragFlag = true
      this.startX = e.pageX
      this.preStartX = e.pageX
      document.body.style['user-select'] = 'none'
      // this.$emit('change', this.position, this.dragData[this.position])
    },
    mousemoveHandler (e) {
      if (this.dragFlag) {
        let offset = e.pageX - this.startX
        if (offset > this.cell / 2) {
          // 边界检测
          if (this.position === this.dragData.length - 1) {
            return
          }
          // range检测
          if (this.range) {
            if (this.range.length === 2) {
              let index = this.findData(this.range[1])
              if (index === this.position) {
                return
              }
            }
          }
          if (!this.$refs.slider.style.left) {
            this.$refs.slider.style.left = 0
          }
          this.$refs.slider.style.left = parseFloat(this.$refs.slider.style.left) + this.cell + 'px'
          this.position++
          this.startX += this.cell
          if (this.start || this.end) {
            this.$refs.slider.innerHTML = this.dragData[this.position]
          }
        } else if (offset < -this.cell / 2) {
          // 边界检测
          if (this.position === 0) {
            return
          }
          // range检测
          if (this.range) {
            if (this.range.length === 2) {
              let index = this.findData(this.range[0])
              if (index === this.position) {
                return
              }
            }
          }
          if (!this.$refs.slider.style.left) {
            this.$refs.slider.style.left = 0
          }
          this.$refs.slider.style.left = parseFloat(this.$refs.slider.style.left) - this.cell + 'px'
          // this.$refs.item[this.position].
          this.position--
          this.startX -= this.cell
          if (this.start || this.end) {
            this.$refs.slider.innerHTML = this.dragData[this.position]
          }
        }
      }
    },
    mouseupHandler (e) {
      this.dragFlag = false
      this.startX = 0
      document.body.style['user-select'] = ''
      if (this.position !== this.current) {
        this.$emit('change', this.position, this.dragData[this.position])
      }
    }
  },
  mounted () {
    if (this.data) {
      this.dragData = this.data
    } else {
      for (var i = this.start; i <= this.end; i += this.interval) {
        this.dragData.push(i)
      }
      if (this.start || this.end) {
        this.$refs.slider.innerHTML = this.dragData[this.position]
      }
    }
    if (this.dragData.length === 0) {
      return
    }
    this.cell = (this.$refs.bar.clientWidth - 10) / (this.dragData.length - 1)
    if (this.start != null) {
      this.position = this.findData(this.start)
      this.$refs.slider.style.left = this.cell * this.position + 'px'
    }
    if (this.labels) {
      this.dragLabels = this.labels
    } else {
      this.dragData.forEach(function (item, i) {
        this.dragLabels.push(item)
      }, this)
    }
    console.log()
    this.$refs.slider.style.left = parseFloat((this.$refs.slider.style.left) || 0) + this.cell + 'px'
    document.addEventListener('mousemove', this.mousemoveHandler)
    document.addEventListener('mouseup', this.mouseupHandler)
  },
  destroy () {
    document.removeEvenutListener('mousemove', this.mousemoveHandler)
    document.removeEventListener('mouseup', this.mouseupHandler)
  }
}
</script>
