/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:58:57
 * @LastEditTime : 2020-01-17 14:42:12
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
          text: '当日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment(start).add(-1, 'day'))
            end.setTime(moment(end).add(-1, 'day'))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(moment().weekday(1))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const lastweek = moment().subtract(7, 'day')
            const last_sunday = moment(lastweek).weekday(7)
            const last_monday = moment(lastweek).weekday(1)
            start.setTime(last_monday)
            end.setTime(last_sunday)
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
