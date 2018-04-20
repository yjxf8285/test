<style lang="scss" scoped>
  @import "~vars";

  $btnHeight: 36px;
  .refresh-btn {
    border-radius: 0;
    float: right;
    padding: 0;
    width: 35px;
    height: $btnHeight;
    line-height: $btnHeight;
    font-size: $font-icon-size-large;
    background-color: #fff;
    color: #666;
    border: 1px solid #dcdcdc;
    border-width: 0px 1px 0px 1px;
    text-align: center;
  }

  .time-selector {
  }
  .auto-fresh-wrap{
    float: right;
    border-left: solid 1px #dcdcdc;
    padding:4px 10px 0 10px;
    height: 36px;
    .label {
      float: left;
      margin: 1px 4px 0 0;
    }
  }
</style>
<template>
  <div class="time-selector">
    <el-date-picker
      class="date-timer"
      popper-class="date-timer-popper"
      v-model="selectedTime"
      :editable="false"
      :clearable="false"
      :time-arrow-control="true"
      type="datetimerange"
      :picker-options="pickerOptions"
      :time-picker-options="timePickerOptions"
      placeholder="选择时间范围"
      @change="pickerOnChange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @focus="onFocus"
    >
    </el-date-picker>
    <el-button type="primary" class="refresh-btn" size="mini" @click="refresh">
      <i class="ion-android-refresh"></i>
    </el-button>
    <div class="auto-fresh-wrap">
      <div class="label" title="每2分钟刷新一次" v-show="false">自动刷新</div>
      <el-switch v-show="false"
        v-model="autoFreshInterval"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
      <el-select style="width: 120px;" size="mini" v-model="autoFreshInterval" placeholder="关闭自动刷新">
        <el-option label="关闭自动刷新" value="999"></el-option>
        <el-option label="每30秒刷新" value="30000"></el-option>
        <el-option label="每1分钟刷新" value="60000"></el-option>
        <el-option label="每2分钟刷新" value="120000"></el-option>
        <el-option label="每5分钟刷新" value="300000"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
  import {
    Button,
    Popover,
    DatePicker,
    Switch,
    Select,
    Option,
    Progress
  } from 'element-ui'

  // 高亮显示快捷选择列表
  const focusTheSidebarItem = function(index) {
    let $shortCutBtn = $(
      '.date-timer-popper .el-picker-panel__sidebar .el-picker-panel__shortcut'
    )
    $shortCutBtn.removeClass('cur')
    $shortCutBtn.eq(index).addClass('cur')
    window.sessionStorage.setItem('curTimeIndex', index)
  }
  const blurTheSidebarItem = function() {
    let $shortCutBtn = $(
      '.date-timer-popper .el-picker-panel__sidebar .el-picker-panel__shortcut'
    )
    $shortCutBtn.removeClass('cur')
    window.sessionStorage.setItem('curTimeIndex', 999)
  }

  let timer
  export default {
    name: 'timer-selector',
    components: {
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'el-date-picker': DatePicker,
      'el-popover': Popover,
      'el-switch': Switch,
      'el-progress': Progress
    },
    props: {
      timeDisabled: false,
      autoRefreshDisabled: false
    },
    data() {
      return {
        shortCutText: '',
        showDataPicker: false,
        selectedTime: [],
        autoFreshInterval: '999',
        duration: 600 * 1000,
        timeMap: [
          60000 * 30,
          3600000,
          3600000 * 6,
          3600000 * 12,
          3600000 * 24,
          3600000 * 72,
          3600000 * 168,
          3600000 * 336,
          2592000000
        ],
        timePickerOptions: {
          format: function() {
            return 'HH:mm'
          }
        },
        pickerOptions: {
          disabledDate: function(time) {
            return time.getTime() > Date.now() // 禁止选择今天之后
          },
          shortcuts: [
            {
              text: '最近30分钟',
              onClick(picker, e) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 60000 * 30)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(0)
              }
            },
            {
              text: '最近1小时',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600000)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(1)
              }
            },
            {
              text: '最近6小时',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600000 * 6)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(2)
              }
            },
            {
              text: '最近12小时',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600000 * 12)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(3)
              }
            },
            {
              text: '最近1天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 86400000)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(4)
              }
            },
            {
              text: '最近3天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 86400000 * 3)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(5)
              }
            },
            {
              text: '最近7天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 604800000)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(6)
              }
            },
            {
              text: '最近14天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 604800000 * 2)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(7)
              }
            },
            {
              text: '最近1个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 2592000000)
                picker.$emit('pick', [start, end])
                focusTheSidebarItem(8)
              }
            }
          ],
          onPick() {
            blurTheSidebarItem()
          }
        }
      }
    },

    watch: {
      autoFreshInterval: function(newVal) {
        let that = this
        window.clearInterval(timer)
        if (newVal !== '999') {
          timer = window.setInterval(() => {
            let end = new Date().getTime()
            let duration = this.timeMap[window.sessionStorage.getItem('curTimeIndex')]
            if (duration) {
              let start = new Date() - duration
              this.selectedTime = [start, end]
            } else {
              that.$root.eventBus.$emit('system-or-time-change', {
                curSystem: that.$root.eventBus.getCurSystem(),
                curTime: that.$root.eventBus.getCurTime()
              })
            }
          }, this.autoFreshInterval)
        } else {
          window.clearInterval(timer)
        }
        window.sessionStorage.setItem('autoFreshInterval', newVal)
      },
      selectedTime: {
        deep: true,
        handler(v) {
          this.duration = v[1] - v[0]
          this.setCurTimeToStore(v)
        }
      }
    },
    mounted() {
      this.getDefaultTime()
    },
    methods: {
      onFocus() {
        let curTimeIndex = window.sessionStorage.getItem('curTimeIndex')
        setTimeout(() => {
          focusTheSidebarItem(curTimeIndex)
        }, 200)
      },
      getDefaultTime() {
        let curTime = this.$root.eventBus.getCurTime()
        let start = Number(curTime.startTime)
        let end = Number(curTime.endTime)
        let curTimeIndex = window.sessionStorage.getItem('curTimeIndex')
        this.selectedTime = [start, end]
        this.autoFreshInterval = window.sessionStorage.getItem('autoFreshInterval') || '999'
        focusTheSidebarItem(curTimeIndex)
      },
      pickerOnChange(v) {
      },
      setCurTimeToStore(v) {
        let time = v
        if (typeof v[0] !== 'number') {
          time = [v[0].getTime(), v[1].getTime()]
        }
        this.$root.eventBus.setCurTime(time)
      },
      refresh() {
        this.setCurTimeToStore(this.selectedTime)
      }
    }
  }
</script>


