/*
 * @Author: AnThen
 * @Date: 2017-08-28 17:25:11
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-28 17:30:04
 */
<style lang="scss" scoped>
@import '~vars';
@import '~mixin';
.mc-dateRange-box{position: absolute; width: 340px; height: 458px; z-index: 100; border: 2px solid $black; background-color: rgba($black,0.8);
  ::-webkit-scrollbar {
    width: 0;
  }
  .step-box{position: relative; float: left; width: 100%; height: 85px; padding: 16px 24px 0 24px; border-bottom: 1px solid $greyMedium; background-color: rgba($black,0.3);
    .strip-box{float: left; width: 100%; height: 16px; margin-top: 32px; border-left: 3px solid $greyMedium; border-right: 3px solid $greyMedium;
      .strip{float: left; width: 100%; height: 3px; overflow: hidden; background-color: $greyMedium; margin-top: 6.5px;}
    }
    .item-box{float: left; width: 100%; height: 48px; margin-top: -48px; padding: 0 3px 0 3px; @include flex-display; @include flex-direction; @include flex-justify-content(space-between);
      .day{width: 80px; height: 100%; cursor: pointer;
        .title{float: left; width: 100%; height: 22px; text-align: center; font-size: 14px; color: $grayLight;}
        .dian-box{float: left; width: 100%; height: 12px; margin-top: 12px; @include flex-display; @include flex-center;
          .dian{width: 8px; height: 8px; background-color: $grayLight;}
        }
      }
      .day:hover{
        .title{font-size: 16px;}
        .dian-box{
          .dian{width: 12px; height: 12px; background-color: rgba($grayLight,0.8);}
        }
      }
      .day.hover{
        .title{color: $chartOrange; font-weight: bold; font-size: 16px;}
        .dian-box{
          .dian{width: 12px; height: 12px; background-color: $main1;}
        }
      }
      .day.no{cursor: no-drop;
        .title{color: $grey;}
        .dian{background-color: $grey;}
      }
      .day.no:hover{
        .title{font-size: 14px; color: $grey;}
        .dian{width: 8px; height: 8px; background-color: $grey;}
      }
    }
  }
  .cont-box{float: left; width: 100%; height: 309px; padding: 20px 0;
    .banner-box{float: left; width: 100%; height: 20px; overflow: hidden; padding: 0 20px 0 24px;
      .text-box{float: left; font-size: 16px; color: $grey;
        .active{float: left; cursor: pointer;}
        .active:hover{color: $white;}
      }
      .button-box{float: right; height: 20px;
        .botton{float: right; width: 20px; height: 20px; overflow: hidden; margin-right: 10px; color: $grey; cursor: pointer; @include flex-display; @include flex-center;}
        .botton:first-child{margin-right: 0;}
        .botton:hover{background-color: $black; color: $chartOrange;}
      }
    }
    .cont-container{position: relative; float: left; width: 100%; height: 259px;
      .week-box{float: left; width: 100%; height: 20px; margin-top: 20px;
        .week{float: left; width: 14.28%; height: 100%; @include flex-display; @include flex-center; font-size: 16px; color: $white;}
      }
      .container{position: absolute; width: 100%; top: 50px; bottom: 0; overflow-x: hidden; overflow-y: auto;
        .yearList{width: 100%;
          .year-box{float: left; width: 25%; height: 63px; overflow: hidden; margin: 5px 0; @include flex-display; @include flex-center;
            .year{width: 46px; height: 46px; @include flex-display; @include flex-center; font-weight: bold; font-size: 14px;}
            .year.readonly{color: $grey; cursor: no-drop;}
            .year.active{color: $grayLight; cursor: pointer;}
            .year.active:hover{border: 2px solid rgba($chartOrange,0.7);}
            .year.readonly.now{color: $chartOrange; cursor: no-drop;}
            .year.active.now{color: $chartOrange; cursor: pointer;}
            .year.active.now:hover{border: 2px solid rgba($chartOrange,0.7);}
            .year.hover{color: $grayLight; cursor: pointer; background-color: $main3;}
          }
        }
        .monthList{width: 100%;
          .month-box{float: left; width: 25%; height: 73px; overflow: hidden; margin: 5px 0; @include flex-display; @include flex-center;
            .month{width: 46px; height: 46px; @include flex-display; @include flex-center; font-weight: bold; font-size: 14px;}
            .month.readonly{color: $grey; cursor: no-drop;}
            .month.active{color: $grayLight; cursor: pointer;}
            .month.active:hover{border: 2px solid rgba($chartOrange,0.7);}
            .month.readonly.now{color: $chartOrange; cursor: no-drop;}
            .month.active.now{color: $chartOrange; cursor: pointer;}
            .month.active.now:hover{color: $grayLight; border: 2px solid rgba($chartOrange,0.7);}
            .month.hover{color: $grayLight; cursor: pointer; background-color: $main3;}
          }
        }
        .dayList{width: 100%;
          .day-box{float: left; width: 14.28%; height: 34px; overflow: hidden; margin-bottom: 1px; @include flex-display; @include flex-center;
            .day{width: 46px; height: 34px; @include flex-display; @include flex-center; font-weight: bold; font-size: 14px;}
            .day.readonly{color: $grey; cursor: no-drop;}
            .day.active{color: $grayLight; cursor: pointer;}
            .day.active:hover{border: 2px solid rgba($chartOrange,0.7);}
            .day.readonly.now{color: $chartOrange; cursor: no-drop;}
            .day.active.now{color: $chartOrange; cursor: pointer;}
            .day.active.now:hover{color: $grayLight; border: 2px solid rgba($chartOrange,0.7);}
            .day.hover{color: $grayLight; cursor: pointer; background-color: $main3;}
            .day.active.now.hover{color: $grayLight;}
          }
          .day-box.hover{background-color: rgba($white,0.15);}
        }
      }
      .container.no-top{top: 10px;}
    }
  }
  .but-box{float: left; width: 100%; height: 60px; border-top: 1px solid $greyMedium; background-color: rgba($black,0.3);
    .preview{float: left; font-size: 12px; color: $grey; margin: 21px 0 0 14px;}
    .button-box{float: right; margin: 15px 16px 0 0;
      .confirm{float: right; width: 70px; height: 30px; margin-right: 12px; cursor: pointer; color: $white; background-color: $main1; @include flex-display; @include flex-center;}
      .confirm:hover{background-color: $main2;}
      .cancel{float: right; width: 70px; height: 30px; border: 2px solid $grey; cursor: pointer; color: $grey; @include flex-display; @include flex-center;}
      .cancel:hover{border-color: $grayLight; background-color: rgba($white,0.2); color: $grayLight;}
    }
  }
}
</style>
<template>
  <div class="mc-dateRange-box" v-if="dateBox" :style="{top: dateBoxClass.top+'px', left: dateBoxClass.left+'px'}">
    <div class="step-box">
      <div class="strip-box">
        <div class="strip"></div>
      </div>
      <div class="item-box">
        <div class="day" :class="itemBox.day30"
        @click="itemBoxChoice('day30',itemBox.day30)">
          <div class="title">30天</div>
          <div class="dian-box">
            <div class="dian"></div>
          </div>
        </div>
        <div class="day" :class="itemBox.day90"
        @click="itemBoxChoice('day90',itemBox.day90)">
          <div class="title">90天</div>
          <div class="dian-box">
            <div class="dian"></div>
          </div>
        </div>
        <div class="day" :class="itemBox.day180"
        @click="itemBoxChoice('day180',itemBox.day180)">
          <div class="title">180天</div>
          <div class="dian-box">
            <div class="dian"></div>
          </div>
        </div>
        <div class="day" :class="itemBox.free"
        @click="itemBoxChoice('free',itemBox.free)">
          <div class="title">自定义</div>
          <div class="dian-box">
            <div class="dian"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cont-box">
      <div class="banner-box">
        <div class="text-box" v-if="bannerBox.yearMonth.show">
          <div class="active"
          @click="initYear">{{bannerBox.yearYear.year}}年</div>
          <div class="active"
          @click="ininMonth(bannerBox.yearYear.year)">{{bannerBox.month.month}}月</div>
        </div>
        <div class="text-box" v-if="bannerBox.month.show">
          <div class="active" @click="initYear">{{bannerBox.yearYear.year}}</div>
        </div>
        <div class="text-box" v-if="bannerBox.yearYear.show">
          {{yearList.confine[0]}}&#126;{{yearList.confine[1]}}
        </div>
        <div class="button-box" v-if="bannerBox.upDown.show">
          <div class="botton fa fa-angle-down"
          @click="rollContainer('down',bannerBox.upDown.obj)"></div>
          <div class="botton fa fa-angle-up"
          @click="rollContainer('up',bannerBox.upDown.obj)"></div>
        </div>
      </div>
      <div class="cont-container">
        <div class="week-box" v-if="containerTop.show">
          <div class="week">一</div>
          <div class="week">二</div>
          <div class="week">三</div>
          <div class="week">四</div>
          <div class="week">五</div>
          <div class="week">六</div>
          <div class="week">日</div>
        </div>
        <div class="container" :class="containerTop.className" ref="container">
          <div class="yearList">
            <div class="year-box"
            v-for="item in yearList.list"
            :key="item.val">
              <div class="year"
              :class="item.type"
              @click="ininMonth(item.val,item.type)">{{item.val}}</div>
            </div>
          </div>
          <div class="monthList">
            <div class="month-box"
            v-for="item in monthList"
            :key="item.val">
              <div class="month"
              :class="item.type"
              @click="monthChange(item.val,item.type)">{{item.val}}月</div>
            </div>
          </div>
          <div class="dayList">
            <div class="day-box" :class="item.boxClass"
            v-for="item in dayList"
            :key="item.val">
              <div class="day"
              :class="item.type"
              @click="dayChange(item.val,item.type)">{{item.val}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="but-box">
      <div class="preview">
        {{dateStart}}&nbsp;至&nbsp;{{dateEnd}}
      </div>
      <div class="button-box">
        <div class="cancel" @click="closeDate()">取消</div>
        <div class="confirm" @click="closeDate('get')">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import util from 'util'
export default {
  data() {
    return {
      dateInput: '',
      dateBox: false,
      dateBoxClass: {
        top: 0,
        left: 0
      },
      dateClass: {
        style: '',
        icon: '',
        inputBox: '',
        input: ''
      },
      lastSub: false,
      itemInterval: {
        day30: 29,
        day90: 89,
        day180: 179
      },
      itemBox: {
        day30: '',
        day90: '',
        day180: '',
        free: ''
      },
      containerTop: {
        className: '',
        show: false
      },
      leastDate: '',
      dateStart: '',
      dateEnd: '',
      dayChangeRecord: '',
      now: {
        year: '',month: '',date: ''
      },
      confine: {
        year: {start: '',end: ''},
        month: {start: '',end: ''},
        day: {start: '',end: ''}
      },
      bannerBox: {
        yearMonth: {
          show: false,
          date: 5,
          upDown: true
        },
        month: {
          show: false,
          month: '',
          upDown: true
        },
        yearYear: {
          show: false,
          year: '',
          upDown: false
        },
        upDown: {
          show: false,
          obj: ''
        }
      },
      yearList: {
        confine: [1970,2020],
        scroll: 0,
        list: []
      },
      monthList: [],
      dayList: []
    }
  },
  props: ["dateBoxRegion","display","dateParam"],
  mounted() {
    if (this.display) {
      this.dateInput = this.display
    }
  },
  watch: {
    dateBoxRegion: {
      deep: true,
      handler (val) {
        if (val) {
          this.openDate()
        }
      }
    },
    dateBox: {
      deep: true,
      handler (val) {
        if (val) {
          window.addEventListener('mousedown', this.otherHandler)
        } else {
          window.removeEventListener('mousedown', this.otherHandler)
        }
      }
    },
    'bannerBox.yearYear.show': {
      deep: true,
      handler (val) {
        if (val) {
          this.containerTop.className = 'no-top'
          this.containerTop.show = false
          this.bannerBox.month.show = false
          this.monthList = []
          this.bannerBox.yearMonth.show = false
          this.dayList = []
          this.bannerBox.upDown.show = this.bannerBox.yearYear.upDown
          this.bannerBox.upDown.obj = ''
        }
      }
    },
    'bannerBox.month.show': {
      deep: true,
      handler (val) {
        if (val) {
          this.containerTop.className = 'no-top'
          this.containerTop.show = false
          this.bannerBox.yearYear.show = false
          this.yearList.list = []
          this.bannerBox.yearMonth.show = false
          this.dayList = []
          this.bannerBox.upDown.show = this.bannerBox.month.upDown
          this.bannerBox.upDown.obj = 'year'
        }
      }
    },
    'bannerBox.yearMonth.show': {
      deep: true,
      handler (val) {
        if (val) {
          this.containerTop.className = ''
          this.containerTop.show = true
          this.bannerBox.yearYear.show = false
          this.yearList.list = []
          this.bannerBox.month.show = false
          this.monthList = []
          this.bannerBox.upDown.show = this.bannerBox.yearMonth.upDown
          this.bannerBox.upDown.obj = 'month'
        }
      }
    }
  },
  methods: {
    openDate (val) {
      let offsetHeight = 0
      let dateParamStartArray = []
      let dateParamEndSplit = []
      let dateParamEndArray = []
      let dateParamEnd
      let date = new Date()
      let nowYear = date.getFullYear()
      let nowMonth = date.getMonth() + 1
      let nowDay = date.getDate()
      let endDate
      let leastDate
      let initItemBoxStart
      if (this.dateParam) {
        if (this.dateParam.lastSub) {this.lastSub = true}
        if (this.dateParam.start) {
          dateParamStartArray = (this.dateParam.start).split('-')
        } else {
          dateParamStartArray = [this.yearList.confine[0],1,1]
        }
        if (this.dateParam.end) {
          dateParamEndSplit = (this.dateParam.end).split('-')
        } else {
          this.lastSub = false
          dateParamEndSplit = [this.yearList.confine[1],12,31]
        }
        if (this.dateParam.top) {this.dateBoxClass.top = this.dateParam.top}
        if (this.dateParam.left) {this.dateBoxClass.left = this.dateParam.left}
      } else {
        dateParamStartArray = [this.yearList.confine[0],1,1]
        dateParamEndSplit = [this.yearList.confine[1],12,31]
      }
      if (this.lastSub) {
        dateParamEndArray = [
          dateParamEndSplit[0],
          dateParamEndSplit[1],
          parseInt(dateParamEndSplit[2])-1
        ]
        endDate = nowYear+'-'+nowMonth+'-'+(parseInt(nowDay)-1)
      } else {
        dateParamEndArray = dateParamEndSplit
        endDate = nowYear+'-'+nowMonth+'-'+nowDay
      }
      dateParamEnd = dateParamEndArray[0]+'-'+dateParamEndArray[1]+'-'+dateParamEndArray[2]
      if ((util.calculateRegion(endDate,dateParamEnd)).type) {
        leastDate = dateParamEnd
      } else {
        leastDate = endDate
      }
      initItemBoxStart = util.longLongAgo(leastDate,30)
      this.leastDate = leastDate
      this.confine = {
        year: {start: dateParamStartArray[0],end: dateParamEndArray[0]},
        month: {start: dateParamStartArray[1],end: dateParamEndArray[1]},
        day: {start: dateParamStartArray[2],end: dateParamEndArray[2]}
      }
      this.now.year = nowYear
      this.now.month = nowMonth
      this.now.day = nowDay
      this.initDate()
      this.initItemBox(initItemBoxStart,leastDate)
      this.dateBox = true
    },
    closeDate (type) {
      let dateInput
      if (type == 'get') {
        dateInput = this.dateStart+'~'+this.dateEnd
      } else {
        dateInput = this.dateInput
      }
      this.$emit("getDate",dateInput)
      this.dateInput = dateInput
      this.dateBox = false
      window.removeEventListener('mouseup', this.otherHandler)
    },
    otherHandler (val) {
      let dateBoxType = false
      for (let i=0; i<val.path.length; i++) {
        if (val.path[i].className == 'mc-dateRange-box') {
          dateBoxType = true
          break
        }
      }
      if (!dateBoxType) {
        this.closeDate()
      }
    },
    initItemBox (start,end) {
      let interval = (util.calculateRegion(start,end)).num
      let day30Interval = parseInt(this.itemInterval.day30)
      let day90Interval = parseInt(this.itemInterval.day90)
      let day180Interval = parseInt(this.itemInterval.day180)
      let longAgo
      let dateInputSplit = []
      this.itemBox.day30 = 'no'
      this.itemBox.day90 = 'no'
      this.itemBox.day180 = 'no'
      this.itemBox.free = ''
      if (interval>=day30Interval) {this.itemBox.day30 = ''}
      if (interval>=day90Interval) {this.itemBox.day90 = ''}
      if (interval>=day180Interval) {this.itemBox.day180 = ''}
      if (this.dateInput) {
        dateInputSplit = (this.dateInput).split('~')
        this.dayRegion(dateInputSplit[0],dateInputSplit[1])
        interval = (util.calculateRegion(dateInputSplit[0],dateInputSplit[1])).num
        switch (interval) {
          case day30Interval:
          this.itemBox.day30 = 'hover'
          break
          case day90Interval:
          this.itemBox.day90 = 'hover'
          break
          case day180Interval:
          this.itemBox.day180 = 'hover'
          break
          default:
          this.itemBox.free = 'hover'
          break
        }
      } else {
        if (interval>=day30Interval) {interval = day30Interval}
        switch (interval) {
          case day30Interval:
          this.itemBox.day30 = 'hover'
          longAgo = util.longLongAgo(end,day30Interval)
          break
          case day90Interval:
          this.itemBox.day90 = 'hover'
          longAgo = util.longLongAgo(end,day90Interval)
          break
          case day180Interval:
          this.itemBox.day180 = 'hover'
          longAgo = util.longLongAgo(end,day180Interval)
          break
          default:
          this.itemBox.free = 'hover'
          longAgo = start
          break
        }
        this.dayRegion(longAgo,end)
      }
    },
    itemBoxChoice (obj,val) {
      let day30Interval = parseInt(this.itemInterval.day30)
      let day90Interval = parseInt(this.itemInterval.day90)
      let day180Interval = parseInt(this.itemInterval.day180)
      let dateStart
      let leastDate = this.leastDate
      let hoverNot
      let boxHoverNot
      let newDayList = this.dayList
      if (val == '') {
        if (this.itemBox.day30=='hover') {
          this.itemBox.day30=''
        }
        if (this.itemBox.day90=='hover') {
          this.itemBox.day90=''
        }
        if (this.itemBox.day180=='hover') {
          this.itemBox.day180=''
        }
        if (this.itemBox.free=='hover') {
          this.itemBox.free=''
        }
        newDayList.map((m,i)=>{
          (m.type).indexOf('hover') > -1 ? hoverNot = (m.type).replace(new RegExp('hover'), "") : hoverNot = m.type
          newDayList[i].type = hoverNot
        })
        newDayList.map((m,i)=>{
          (m.boxClass).indexOf('hover') > -1 ? boxHoverNot = (m.boxClass).replace(new RegExp('hover'), "") : boxHoverNot = m.boxClass
          newDayList[i].boxClass = boxHoverNot
        })
        switch (obj) {
          case 'day30':
          this.itemBox.day30='hover'
          dateStart = util.longLongAgo(leastDate,day30Interval)
          this.dayRegion(dateStart,leastDate)
          break
          case 'day90':
          this.itemBox.day90='hover'
          dateStart = util.longLongAgo(leastDate,day90Interval)
          this.dayRegion(dateStart,leastDate)
          break
          case 'day180':
          this.itemBox.day180='hover'
          dateStart = util.longLongAgo(leastDate,day180Interval)
          this.dayRegion(dateStart,leastDate)
          break
          case 'free':
          this.itemBox.free='hover'
          break
        }
      }
    },
    itemBoxChange (start,end) {
      let interval = (util.calculateRegion(start,end)).num
      let longAgo
      let day30Interval = parseInt(this.itemInterval.day30)
      let day90Interval = parseInt(this.itemInterval.day90)
      let day180Interval = parseInt(this.itemInterval.day180)
      if ((this.itemBox.day30).indexOf('hover') > -1) {
        this.itemBox.day30 = (this.itemBox.day30).replace(new RegExp('hover'), "")
      }
      if ((this.itemBox.day90).indexOf('hover') > -1) {
        this.itemBox.day90 = (this.itemBox.day90).replace(new RegExp('hover'), "")
      }
      if ((this.itemBox.day180).indexOf('hover') > -1) {
        this.itemBox.day180 = (this.itemBox.day180).replace(new RegExp('hover'), "")
      }
      this.itemBox.free = ''
      if (interval>=day30Interval) {this.itemBox.day30 = ''}
      if (interval>=day90Interval) {this.itemBox.day90 = ''}
      if (interval>=day180Interval) {this.itemBox.day180 = ''}
      switch (interval) {
        case day30Interval:
        this.itemBox.day30 = 'hover'
        longAgo = util.longLongAgo(end,day30Interval)
        break
        case day90Interval:
        this.itemBox.day90 = 'hover'
        longAgo = util.longLongAgo(end,day90Interval)
        break
        case day180Interval:
        this.itemBox.day180 = 'hover'
        longAgo = util.longLongAgo(end,day180Interval)
        break
        default:
        this.itemBox.free = 'hover'
        longAgo = start
        break
      }
      this.dayRegion(longAgo,end)
    },
    dayChange (val,type) {
      let chooseDate = this.bannerBox.yearYear.year+'-'+this.bannerBox.month.month+'-'+val
      let bigOrSmall
      let start
      let end
      let thisType
      let newDayList = []
      if (type&&type=='readonly') {return}
      if (this.dayChangeRecord) {
        bigOrSmall = util.calculateRegion(this.dayChangeRecord,chooseDate)
        if (bigOrSmall.type) {
          start = chooseDate
          end = this.dayChangeRecord
        } else {
          start = this.dayChangeRecord
          end = chooseDate
        }
        this.dayChangeRecord = ''
      } else {
        this.dayChangeRecord = chooseDate
        this.dateStart = chooseDate
        this.dateEnd = chooseDate
        start = chooseDate
        end = chooseDate
      }
      this.dayList.map((m)=>{
        if ((m.type).indexOf('hover') > -1) {
          thisType = (m.type).replace(new RegExp('hover'), "")
        } else {
          thisType = m.type
        }
        newDayList.push({
          val: m.val,
          type: thisType,
          boxClass: ''
        })
      })
      this.dayList = newDayList
      this.dayRegion(start,end)
      this.itemBoxChange(start,end)
    },
    monthChange (val,type) {
      let year = this.bannerBox.yearYear.year
      if (type&&type=='readonly') {return}
      this.initDate(year,val)
      this.dayRegion(this.dateStart,this.dateEnd)
    },
    initDate (year,month) {
      let dateList = []
      let date = new Date()
      let yearNum
      let monthNum
      let startYear = parseInt(this.confine.year.start)
      let endYear = parseInt(this.confine.year.end)
      let startMonth = parseInt(this.confine.month.start)
      let endMonth = parseInt(this.confine.month.end)
      let startDay = parseInt(this.confine.day.start)
      let endDay = parseInt(this.confine.day.end)
      let nowYear = parseInt(this.now.year)
      let nowMonth = parseInt(this.now.month)
      let nowDay = parseInt(this.now.day)
      let calculateStart
      let calculateEnd
      let calculateRegionStart
      let calculateRegionEnd
      let dateLength
      let oneDateWeekday
      if (year&&month) {
        yearNum = parseInt(year)
        monthNum = parseInt(month)
      } else {
        yearNum = date.getFullYear()
        monthNum = date.getMonth() + 1
      }
      date = new Date(yearNum,monthNum,0)
      dateLength = date.getDate()
      date.setDate(1)
      oneDateWeekday = date.getDay()
      if (oneDateWeekday == 0) {oneDateWeekday=7}
      for (let i=1; i<oneDateWeekday; i++) {
        dateList.push({
          val: '',
          type: ''
        })
      }
      calculateStart = startYear+'-'+startMonth+'-'+startDay
      calculateEnd = yearNum+'-'+monthNum+'-'+1
      calculateRegionStart = util.calculateRegion(calculateStart,calculateEnd)
      calculateEnd = yearNum+'-'+monthNum+'-'+dateLength
      calculateStart = endYear+'-'+endMonth+'-'+endDay
      calculateRegionEnd = util.calculateRegion(calculateStart,calculateEnd)
      if ((!calculateRegionStart.type)&&(calculateRegionEnd.type)) {
        for (let i=1; i<=dateLength; i++) {
          dateList.push({
            val: i,
            type: 'active'
          })
        }
      }
      if ((!calculateRegionStart.type)&&(!calculateRegionEnd.type)) {
        for (let i=1; i<=dateLength; i++) {
          if (i<=(dateLength-calculateRegionEnd.num)) {
            dateList.push({
              val: i,
              type: 'active'
            })
          } else {
            dateList.push({
              val: i,
              type: 'readonly'
            })
          }
        }
      }
      if ((calculateRegionStart.type)&&(!calculateRegionEnd.type)) {
        for (let i=1; i<=dateLength; i++) {
          if ((i>(calculateRegionStart.num))&&(i<=(dateLength-calculateRegionEnd.num))) {
            dateList.push({
              val: i,
              type: 'active'
            })
          } else {
            dateList.push({
              val: i,
              type: 'readonly'
            })
          }
        }
      }
      if ((calculateRegionStart.type)&&(calculateRegionEnd.type)) {
        for (let i=1; i<=dateLength; i++) {
          if (i>(calculateRegionStart.num)) {
            dateList.push({
              val: i,
              type: 'active'
            })
          } else {
            dateList.push({
              val: i,
              type: 'readonly'
            })
          }
        }
      }
      if ((yearNum==nowYear)&&(monthNum==nowMonth)) {
        for (let i=0; i<dateLength; i++) {
          if (dateList[i].val==nowDay) {
            dateList[i].type = dateList[i].type + ' now'
          }
        }
      }
      this.bannerBox.month.month = monthNum
      this.bannerBox.yearYear.year = yearNum
      this.bannerBox.yearMonth.show = true
      this.dayList = dateList
    },
    ininMonth (year,type) {
      let monthList = []
      let date = new Date()
      let yearNum
      let startYear = parseInt(this.confine.year.start)
      let endYear = parseInt(this.confine.year.end)
      let startMonth = parseInt(this.confine.month.start)
      let endMonth = parseInt(this.confine.month.end)
      let nowYear = parseInt(this.now.year)
      let nowMonth = parseInt(this.now.month)
      let confine = false
      let confineMonth = false
      let confineStartMonth = false
      let confineEndMonth = false
      if (type&&type=='readonly') {return}
      if (year) {
        yearNum = parseInt(year)
      } else {
        yearNum = date.getFullYear()
      }
      if ((startYear<=yearNum)&&(yearNum<=endYear)) {
        confine = true
        if ((startYear<yearNum)&&(yearNum<endYear)) {
          confineMonth = true
        }
        if (startYear==yearNum) {
          confineStartMonth = true
        }
        if (endYear==yearNum) {
          confineEndMonth = true
        }
      }
      for (let i=1; i<13; i++) {
        if (confine) {
          if (confineMonth) {
            monthList.push({
              val: i,
              type: 'active'
            })
          }
          if (confineStartMonth && confineEndMonth) {
            if ((startMonth<=i)&&(i<=endMonth)) {
              monthList.push({
                val: i,
                type: 'active'
              })
            } else {
              monthList.push({
                val: i,
                type: 'readonly'
              })
            }
          }
          if (confineStartMonth && !confineEndMonth) {
            if (startMonth<=i) {
              monthList.push({
                val: i,
                type: 'active'
              })
            } else {
              monthList.push({
                val: i,
                type: 'readonly'
              })
            }
          }
          if (!confineStartMonth && confineEndMonth) {
            if (i<=endMonth) {
              monthList.push({
                val: i,
                type: 'active'
              })
            } else {
              monthList.push({
                val: i,
                type: 'readonly'
              })
            }
          }
        } else {
          monthList.push({
            val: i,
            type: 'readonly'
          })
        }
        if ((nowYear==yearNum)&&(nowMonth==i)) {
          monthList[i-1].type = monthList[i-1].type + ' now'
        }
      }
      this.bannerBox.yearYear.year = yearNum
      this.bannerBox.month.show = true
      this.monthList = monthList
    },
    initYear () {
      let yearList = []
      let startYear = parseInt(this.confine.year.start)
      let endYear = parseInt(this.confine.year.end)
      let nowYear = parseInt(this.now.year)
      let startYearNum = parseInt(this.yearList.confine[0])
      let endYearNum = parseInt(this.yearList.confine[1])
      let yearLength = endYearNum - startYearNum
      let yearLineNum = 0
      for (let i=0; i<=yearLength; i++) {
        if ((startYear<=(startYearNum+i))&&((startYearNum+i)<=endYear)) {
          yearList.push({
            val: startYearNum+i,
            type: 'active'
          })
        } else {
          yearList.push({
            val: startYearNum+i,
            type: 'readonly'
          })
        }
        if ((startYearNum+i)==nowYear) {
          yearList[i].type = yearList[i].type + ' now'
        }
      }
      this.bannerBox.yearYear.show = true
      this.yearList.list = yearList
      this.$nextTick(()=>{
        yearLineNum = (parseInt(startYear) - parseInt(this.yearList.confine[0])) / 4
        yearLineNum = parseInt(yearLineNum)
        this.$refs.container.scrollTop = yearLineNum * 73
      })
    },
    rollContainer (type,obj) {
      let year
      let month
      let confineYearStart = parseInt(this.confine.year.start)
      let confineYearEnd = parseInt(this.confine.year.end)
      let confineMonthStart = parseInt(this.confine.month.start)
      let confineMonthEnd = parseInt(this.confine.month.end)
      switch (obj) {
        case 'year':
        year = parseInt(this.bannerBox.yearYear.year)
        if ((type=='up')&&((year-1)>=confineYearStart)) {
          year = year - 1
        }
        if ((type=='down')&&((year+1)<=confineYearEnd)) {
          year = year + 1
        }
        this.bannerBox.yearYear.year = year
        this.ininMonth(year)
        break
        case 'month':
        year = parseInt(this.bannerBox.yearYear.year)
        month = parseInt(this.bannerBox.month.month)
        if ((type=='up')&&(year==confineYearStart)&&(month-1)>=confineMonthStart) {
          month = month - 1
        }
        if ((type=='up')&&(year>confineYearStart)) {
          month = month - 1
        }
        if ((type=='down')&&(year==confineYearEnd)&&((month+1)<=confineMonthEnd)) {
          month = month + 1
        }
        if ((type=='down')&&(year<confineYearEnd)){
          month = month + 1
        }
        if (month<1) {
          year = year - 1
          month = 12
        }
        if (month>12) {
          year = year + 1
          month = 1
        }
        this.bannerBox.yearYear.year = year
        this.bannerBox.month.month = month
        this.initDate(year,month)
        this.dayRegion(this.dateStart,this.dateEnd)
        break
      }
    },
    dayRegion (start,end) {
      let that = this
      let distinguish
      let prefix = this.bannerBox.yearYear.year + '-' + this.bannerBox.month.month + '-'
      let resultStart
      let resultEnd
      let hoverOk
      let newDayList = []
      if (this.dayList.length < 1) return
      this.dayList.map((m,i)=>{
        if ((m.type).indexOf('active') > -1) {
          distinguish = prefix + m.val
          resultStart = util.calculateRegion(distinguish,start)
          resultEnd = util.calculateRegion(end,distinguish)
          if (resultStart.type && resultEnd.type) {
            if (distinguish == start) {
              (m.type).indexOf('hover') > -1 ? hoverOk = m.type : hoverOk = m.type + ' hover'
              newDayList.push({
                val: m.val,
                type: hoverOk,
                boxClass: 'hover'
              })
            } else if (distinguish == end) {
              (m.type).indexOf('hover') > -1 ? hoverOk = m.type : hoverOk = m.type + ' hover'
              newDayList.push({
                val: m.val,
                type: hoverOk,
                boxClass: 'hover'
              })
            } else {
              newDayList.push({
                val: m.val,
                type: m.type,
                boxClass: 'hover'
              })
            }
          } else {
            newDayList.push({
              val: m.val,
              type: m.type,
              boxClass: ''
            })
          }
        } else {
          newDayList.push({
              val: m.val,
              type: m.type,
              boxClass: ''
            })
        }
      })
      this.dateStart = start
      this.dateEnd = end
      this.dayList = newDayList
    }
  }
}
</script>
