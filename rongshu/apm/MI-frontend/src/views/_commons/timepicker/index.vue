<style lang="scss" scoped>
  @import "~vars";
  .time-picker {
    display: inline-block;
  }
  .current-interval {
    display: inline-block;
    text-align: center;
  }
  .popover {
    width: 400px;
    padding: 20px;
  }
  .btns {
    text-align: right;
    margin-top: 10px;
    button:not(:last-child) {
      margin-right: 10px;
    }
  }
</style>
<template>
  <div class="time-picker">
    <au-popover trigger="click" plain placement="bottom right" y-fix="-12px" x-fix="-1px" ref="popover" @hide="handlePopoverHide">
      <div slot="target" class="current-interval">
        <au-button type="warning" :size="size">{{ interval|| '请选择时间段' }}</au-button>
      </div>
      <div slot="content" class="popover">
        <dragbar :scale="intervals" :value="currentIntervalIndex" @change="handleIntervalChange"/>
        <div class="btns">
          <au-button type="primary" @click="handleConfirm">确定</au-button>
          <au-button @click="$refs.popover.hide()">取消</au-button>
        </div>
      </div>
    </au-popover>
  </div>
</template>
<script>
  import dragbar from '../dragbar/index'
  import store from '_store'
  export default {
    components: {
      dragbar
    },
    mounted () {
      // init interval in store  and trigger ready events
      store.setCurrentInterval(store.getCurrentInterval() || store.intervals[0])

      let index = this.intervals.indexOf(this.interval)
      this.currentIntervalIndex = index !== -1 ? index : 0
    },
    beforeDestroy  () {
      this.$refs.popover.hide()
    },
    data () {
      return {
        intervals: store.intervals,
        currentIntervalIndex: store.intervals.indexOf(store.getCurrentInterval()),
        interval: store.getCurrentInterval()
      }
    },
    props: {
      size: String
    },
    watch: {
      interval (v) {
        store.setCurrentInterval(v)
      }
    },
    methods: {
      handleIntervalChange (value, index) {
        this.currentIntervalIndex = index
      },
      handleConfirm () {
        this.interval = this.intervals[this.currentIntervalIndex]
        this.$refs.popover.hide()
      },
      handlePopoverHide () {
        let index = this.intervals.indexOf(this.interval)
        if (index !== this.currentIntervalIndex) {
          this.currentIntervalIndex = index !== -1 ? index : 0
        }
      }
    }
  }
</script>
