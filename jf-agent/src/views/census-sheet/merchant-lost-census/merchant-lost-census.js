/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:58:57
 * @LastEditTime : 2020-01-17 15:09:39
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/kaishua-manage/ishua-pos-query/ishua-pos-query.js
 */
import moment from 'moment'

export default {
  data() {
    return {
      type: '',
      visibleDialog: false,
      createTime: '',
      pickerOptions: {
        shortcuts: [{
          text: '近15天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment(start).add(-15, 'day'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment(start).add(-30, 'day'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const month_start = moment().startOf('month')
            start.setTime(month_start)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const lastMonth_start = moment().subtract(1, 'month').startOf('month')
            const lastMonth_end = moment().subtract(1, 'month').endOf('month')
            start.setTime(lastMonth_start)
            end.setTime(lastMonth_end)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      createTime2: '',
      pickerOptions2: {
        shortcuts: [{
          text: '近15天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment(start).add(-15, 'day'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment(start).add(-30, 'day'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const month_start = moment().startOf('month')
            start.setTime(month_start)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const lastMonth_start = moment().subtract(1, 'month').startOf('month')
            const lastMonth_end = moment().subtract(1, 'month').endOf('month')
            start.setTime(lastMonth_start)
            end.setTime(lastMonth_end)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  }
}
