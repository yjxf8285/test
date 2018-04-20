/*
 * @Author: AnThen
 * @Date: 2017-08-12 12:30:25
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-30 17:35:25
 */
<style lang="scss" scoped>
@import '~vars';
.journey{
  width: 100%;
  height: 100%;
  background-color: $greyDarken;
  position: relative;

  .header {
    $height: 50px;
    height: $height;
    border-top: 1px solid rgba(255,255,255,0.15);
    .calendar {
      position: relative; float: left;
      $height: 30px; width: $height*10; font-size: 14px;
      color: #999;
      .icon-box {
        float: left; margin-top: 7.5px; margin-right: 8px;
        height: $height+2; width: $height+2;
        i {
          font-size: 18px; line-height: 32px;
          &:hover { color: #fff; background-color: rgba(255,255,255,0.2)}
        }
      }
      .icon-box.disabled {
        &:hover { cursor: not-allowed }
      }
      .input-box {
        line-height: $height;
        margin-top: 9px;  float: left;
        height: $height; width: 260px;
        input {
          background-color: transparent; border: none; width: 260px;
        }
      }
    }
    .compare {
      float: right;
      padding-right: 10px;
      $height: 50px;
      width: auto; height: $height;
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      button {
        margin-top: 9px;
        width: 90px; height: 30px;
        border: none; outline: none;
        background-color: #009688;
        &:hover { background-color: #4db6ac; }
      }
      .quit {
        width: 100px;
        text-align: right; padding-right: 10px;
        i {
          position: absolute;
          z-index: 98;
          right: 219px; top: 17px;
        }
      }
      .confirm {
        $background-color: rgba(0,150,136,0.3);
        background-color: $background-color;
        cursor: not-allowed;
        &:hover { background-color: $background-color; }
      }
      .cancel {
        background-color: transparent;
        color: #999;
        &:hover { background-color: rgba(255,255,255,0.15); }
      }
    }
    .info {
      cursor: pointer; border: none; outline: none;
      float: right;
      width: 112px; height: 100%;
      margin-right: 24px;
      line-height: $height;
      background-color: $white;
      text-align: center;
      font-size: 14px;
      .users {
        position: relative;
        float: left;
        left: 14px; top: 16px;
        font-size: 16px;
      }
    }
    .info.inactivated {
      background-color: $greyDarken;
      color: $grey;
      &:hover {background-color: rgba(255,255,255,0.2); color: $grayLight;}
    }
    .data {
      box-shadow: 0px 10px 20px rgba(0,0,0,0.2);
      border: 1px solid $grayLight;
      position: absolute;
      float: right;
      right: 24px;
      top: 50px;
      width: 210px; height: 240px;
      z-index: 99;
      background-color: $white;
      ol {
        text-align: center;
        li {
          width: 172px;
          display: inline-block;
        }
      }
      .display {
        padding-top: 14px;
        li {
          $height: 44px;
          margin-top: 1px;
          height: $height; line-height: $height;
          background-color: $grayBrighten;
          span {
            float: left;
            i {
              width: 46px; height: $height;
              font-size: 20px;
              background-color: rgba(204,204,204,0.6);
              line-height: $height;
              color: $greyDarken;
            }
          }
          span.num {
            margin-top: -7px;
            font-size: 12px;
            text-align: left;
            padding-left: 10px;
            height: $height/2; width: 126px;
            color: $greyMedium;
          }
          span.num.num2 {
            float: left;
          }
          span.num.num3 {
            float: right;
            padding-top: 2px;
            font-weight: bold;
          }
        }
      }
      .analysis {
        padding-top: 21px; padding-bottom: 22px;
        li:first-child { margin-bottom: 10px; }
        li {
          height: 15px;
          font-size: 12px; font-weight:bold;
          span.day {
            float: left;
            margin-top: -1.9px;
            padding-left: 1px;
          }
          span.num {
            float: right;
            padding-right: 37px;
          }
          span.tend {
            float: right;
            i {
              float: left;
              padding-right: 12px;  padding-top: 1px;
              font-size: 12px;
            }
            i.up {
              color: $success;
            }
            i.down {
              color: $danger;
            }
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    $border: 24px;
    bottom: $border+28; right: $border+28;
    z-index: 98;
    $font-size: 12px;
    font-size: $font-size;
    width: $font-size*8; height: auto;
    ol {
      li+li {
        padding-top: 2px;
      }
      li {
        color: $greyMedium;
        img {
          margin: 0 5.9px -2.6px -5px ;
        }
        i {
          font-size: $font-size;
          float: left;
          padding-right: $font-size; padding-top: 3.5px;
        }
        i.chartPurpleDarken {
          color: $chartPurpleDarken;
        }
        i.chartBlueLight {
          color: $chartBlueLight;
        }
        i.chartOrangeLight {
          color: $chartOrangeLight;
        }
        i.chartGreenDarken {
          color: $chartGreenDarken;
        }
        i.grey {
          color: $grey;
        }
        i.lightOrange {
          color: #FFB74D;
        }
        i.slightlyDesaturatedLimeGreen {
          color: #81C784;
        }
        i.moderateCyan {
          color: #4DB6AC;
        }
      }
    }
  }
  .magnifier {
    position: absolute;
    z-index: 98;
    background-color: white;
    $color: rgba(204,204,204,0.6);
    $border: 2px;
    $width: 26px;
    bottom: $width+26; left: $width+8;
    width: $width+$border; height: $width*3+$border;
    border: $border solid $color;
    ol {
      li:first-child { padding-top: 1px; }
      li+li { border-top: $border solid $color}
      li {
        width: $width; height: $width;
        color: $grey;
        &:hover { color: $greyDarken; }
        i {
          padding-top: 1px; padding-right: 1px;
          font-size: 20px;
          &:hover {cursor: pointer}
        }
      }
    }
  }
  .view {
    $padding: 24px; background: #FFF url(../../../assets/images/journey/cell.png);
    position: absolute;
    top: 50px;
    left: 0;
    right: $padding;
    bottom: $padding;
    overflow: auto;
    .loadding {
      position: absolute; z-index: 99;
      width: 100%; height: 100%; background-color: rgba(0,0,0,0.8);
      img {
        position: absolute; top: 37%; left: 40%;
      }
    }
  }

  .lost-analysis div {
    border-top: solid 1px #e7e7e7;
  }
}
</style>
<template>
  <div class="journey">
    <header class="header">
      <div class="calendar">
        <div class="icon-box" :class="calendarIconClass" @click="showDateBox" ><i class="icon fa fa-calendar"></i></div>
        <div class="input-box">
          <input
            type="text"
            placeholder="请选择日期"
            class="input"
            readonly="readonly"
            v-model="dateInputDisplay">
          </input>
        </div>
        <mc-dateRange
          :dateParam="dateParam"
          :display="dateDisplay"
          :dateBoxRegion="dateBoxRegion"
          v-on:getDate="listenAsDate">
        </mc-dateRange>
      </div>

      <button class="info" :class="infoClassName" @click="clickSwitchInfo()"><i class="icon fa fa-users users"></i>人群信息</button>
      <div class="compare" v-if="mode===MODE.PRE_COMPARE">
        <button class="cancel" @click="toDefaultDisplay()">取消</button>
        <button :class="confirmClassName" :disabled="confirmClassName!==''" @click="getJourneyCompare()">确认</button>
      </div>
      <div class="compare" v-if="mode===MODE.RESULT">
        <button class="quit" @click="toDefaultDisplay()"><i class="icon fa fa-reply"></i>退出对比</button>
      </div>
      <div class="data" v-show="infoSeen" v-if="infoData.yesterday">
        <ol class="display">
          <li><span><i class="icon fa fa-users"></i></span><div><span class="num num2">人群总数</span><span class="num num3">{{infoData.groupTotal}}</span></div></li>
          <li><span><i class="icon fa fa-slideshare"></i></span><div><span class="num num2">旅程人数</span><span class="num num3">{{infoData.attendeeTotal}}</span></div></li>
          <li><span><i class="icon fa fa-flag"></i></span><div><span class="num num2">累计完成</span><span class="num num3">{{infoData.convertedTotal}}</span></div></li>
        </ol>
        <ol class="analysis">
          <li><span class="day">昨日</span><span class="tend"><i v-if="infoData.yesterday.trend > 0" class="icon fa fa-level-up up"></i><i v-if="infoData.yesterday.trend < 0" class="icon fa fa-level-down down"></i>{{infoData.yesterday.trendValue}}</span><span class="num">{{infoData.yesterday.total}}</span></li>
          <li><span class="day">近30天</span><span class="tend"><i v-if="infoData.last30Days.trend > 0" class="icon fa fa-level-up up"></i><i v-if="infoData.last30Days.trend < 0" class="icon fa fa-level-down down"></i>{{infoData.last30Days.trendValue}}</span><span class="num">{{infoData.last30Days.total}}</span></li>
        </ol>
      </div>
    </header>
    <div class="view">
      <div class="loadding" v-if="loadding">
        <img :src="LOADDING_GIF" />
      </div>
      <journey-view
        :scale="scale"
        :dataSource="dataNodeSource"
        :mode="mode"
        :onModeChange="onModeChange"
        :onMenuChange="onMenuChange"
        :onNodeSelectedChange="onNodeSelectedChange"
        :onLostAnalysis="onLostAnalysis"
        ref="journey_view" />
    </div>
    <footer class="footer" v-if="mode===MODE.NORMAL && modeMenu===MODE.NORMAL">
      <ol>
        <li><img :src="PERSON_PNG"/>流入人群</li>
        <li><i class="icon fa fa-stop chartPurpleDarken"></i>进入旅程</li>
        <li><i class="icon fa fa-stop chartBlueLight"></i>留在当前环节</li>
        <li><i class="icon fa fa-stop chartOrangeLight"></i>流入下一环节</li>
        <li><i class="icon fa fa-stop chartGreenDarken"></i>成功转化</li>
        <li><i class="icon fa fa-stop grey"></i>流失</li>
      </ol>
    </footer>
    <footer class="footer" v-if="mode===MODE.RESULT">
      <ol>
        <li><img :src="PERSON_PNG"/>流入人群</li>
        <li><i class="icon fa fa-stop lightOrange"></i>活动促销</li>
        <li><i class="icon fa fa-stop slightlyDesaturatedLimeGreen"></i>广告</li>
        <li><i class="icon fa fa-stop moderateCyan"></i>分享链接</li>
      </ol>
    </footer>
    <footer class="magnifier" v-if="modeMenu===MODE.NORMAL">
      <ol>
        <li><i class="icon fa fa-search-plus"></i></li>
        <li><i class="icon fa fa-search-minus"></i></li>
        <li><i class="icon fa fa-arrows-alt"></i></li>
      </ol>
    </footer>
    <mc-modal
      title="用户流失分析"
      width="622px"
      height="438px"
      :display="lostAnalysisModalDisplay"
      @mc-modal-off="() => this.lostAnalysisModalDisplay = false">
      <div class="lost-analysis">
        <div>
          <lost-view :dataSource="lostAnalysisData" />
        </div>
        <div>
          <top4-view :dataSource="top4PossibleData" :dropped="top4DroppedData" />
        </div>
      </div>
    </mc-modal>
  </div>
</template>
<script>
import { JourneyView, LostView, Top4View } from '../../../components/journey';
import httpProxy from '../../../test/httpProxy'
import api from '../../../constants/api'
import httpConstants from '../../../constants/http'

import dateRange from '../../../components/mc-ui/components/date/range'
import modal from '../../../components/mc-ui/components/modal';
import { MODE } from '../../../components/journey/constants/define';
import UTIL from '../../../components/util'

import equals from 'ramda/src/equals';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import filter from 'ramda/src/filter';
import map from 'ramda/src/map';
import pathOr from 'ramda/src/pathOr';
import ap from 'ramda/src/ap';
import sum from 'ramda/src/sum';

import {
  DROPPED,
  PRESENT,
} from '../../../components/journey/constants/define';


const HTTP_METHOD = httpConstants.HTTP_METHOD;

const droppedDataPredicate = (i => i.type === 'dropped');
const droppedDataFilter = filter(droppedDataPredicate);
const droppedDataPath = pathOr([], ['props', 'data']);
const isDroppedLengthOne = compose(
  equals(1),
  prop('length'),
  droppedDataFilter,
  droppedDataPath,
);

const pickPredicate = i => i.type === DROPPED || i.type === PRESENT;
const pickDataFilter = filter(pickPredicate)
const getPickItemSum = compose(
  sum,
  map(({ value }) => value),
  pickDataFilter,
);

export default {
  name: 'journey',
  components: {
    JourneyView,
    LostView,
    Top4View,
    'mc-dateRange': dateRange,
    'mc-modal': modal,
  },
  data () {
    return {
      topBcnRoot: this.GLOBAL.bcn.root,
      topBcnSecond: this.GLOBAL.bcn.second,
      PERSON_PNG: require('../../../assets/images/journey/person.png'),
      LOADDING_GIF: require('../../../assets/img/loading.gif'),
      loadding: true,
      scale: 1.0,
      clickSwitch: false,
      infoSeen: false,
      infoClassName: 'inactivated',
      infoData: {},
      dataNodeSource: {},
      dataNodeSourcePrevious: {},
      mode: MODE.NORMAL,
      modeMenu: MODE.NORMAL,
      MODE,
      calendarIconClass: '',
      confirmClassName: 'confirm',
      dateBoxRegion: false,
      modalDisplay: false,
      dateParam: {
        start: '2017-6-10',
        end: '2017-9-5',
        lastSub: false,
        top: 46,
        left: 0,
      },
      dateDisplay: '',
      journeyParam: {},
      recentDay: 30,
      lostAnalysisModalDisplay: false,
      lostAnalysisData: void 0,
      top4PossibleData: void 0,
      top4DroppedData: void 0
    }
  },
  computed: {
    dateInputDisplay: function() {
      return this.dateDisplay + '     (近' + this.recentDay + '天)'
    }
  },
  methods: {
    async removeLoad() {
      await setTimeout(() => {
        this.loadding = false
        if (!this.infoSeen && !this.clickSwitch) {
          this.switchInfo()
        }
      }, 2500);  // for loading more time
    },
    reload() {
      this.loadding = true                    // reloadding
      if (this.infoSeen) {this.switchInfo()}  // close infoData when reloadding
    },
    async getJourneyDetail() {
      this.reload()
      const url = api.WEB.JOURNEY_DETAIL
      const params =  {
        "journey_id": this.$route.query.id,
        "from_time": this.journeyParam.from_time,
        "to_time": this.journeyParam.to_time,
      }
      const response = await httpProxy.request(url, HTTP_METHOD.GET, params)
      await this.removeLoad()                 // end loadding, turn on infoData
      this.dataNodeSource = response.data
      this.dataNodeSourcePrevious = response.data
    },
    async getJourneyIndicator() {
      const indicatorUrl = api.WEB.JOURNEY_INDICATOR
      const indicatorResponse = await httpProxy.request(indicatorUrl, HTTP_METHOD.GET);
      if (indicatorResponse.code === 0) {
        this.infoData = indicatorResponse.data
      }
    },
    switchInfo () {
      this.infoSeen = !this.infoSeen;
      if (this.infoSeen) {
        this.infoClassName = ''
      } else {
        this.infoClassName = 'inactivated'
      }
    },
    clickSwitchInfo() {
      this.switchInfo()
      this.clickSwitch = !this.clickSwitch
    },
    listenAsDate (val) {
      let valSp
      let from_time
      let to_time
      if (val) {
        valSp = val.split('~')
        from_time = new Date(Date.parse((valSp[0]).replace(/-/g,"/"))).getTime()
        to_time = new Date(Date.parse((valSp[1]).replace(/-/g,"/"))).getTime()
        this.recentDay = UTIL.calculateRegion(valSp[0], valSp[1]).num + 1
        this.dateDisplay = val
        this.journeyParam.from_time = from_time
        this.journeyParam.to_time = to_time
        this.getJourneyDetail()
      }
      this.dateBoxRegion = false
    },
    showDateBox () {
      if (this.mode === MODE.NORMAL && this.modeMenu === MODE.NORMAL) {
        this.dateBoxRegion = true
      }
    },
    onMenuChange(mode) {
      this.modeMenu = mode;
      if (this.modeMenu !== MODE.NORMAL) {
        this.calendarIconClass = 'disabled'
        this.infoClassName = 'inactivated'
        this.infoSeen = false
        this.GLOBAL.appBackLayer.top = '0';
      } else {
        this.calendarIconClass = ''
        this.GLOBAL.appBackLayer.top = '100%';
      }
    },
    onModeChange(mode, x) {
      this.mode = mode
      if (this.mode !== MODE.NORMAL) {
        this.calendarIconClass = 'disabled'
      } else {
        this.calendarIconClass = ''
      }
    },
    toDefaultDisplay() {
      this.mode = MODE.NORMAL
      this.dataNodeSource = this.dataNodeSourcePrevious
      this.confirmClassName = 'confirm'
      this.calendarIconClass = ''
    },
    onNodeSelectedChange(SelectedNodes) {
      if (SelectedNodes.length >= 2) {
        this.confirmClassName = ''
      } else {
        this.confirmClassName = 'confirm'
      }
    },
    async onLostAnalysis(node) {
      if (isDroppedLengthOne(node)) {
        this.lostAnalysisModalDisplay = true;
        this.lostAnalysisData = (node);

        const data = pathOr([], ['props', 'data'], node);
        const sum = getPickItemSum(data);

        this.top4DroppedData = sum;

        // 发起请求 await
        const { data: top4PossibleData, code, msg } = await httpProxy.request(api.WEB.LOSS_SORT);
        this.top4PossibleData = top4PossibleData;
      }
    },
    async getJourneyCompare() {
      this.reload()
      const response = await httpProxy.request(api.WEB.JOURNEY_CONTRAST, HTTP_METHOD.POST);
      await this.removeLoad()
      this.dataNodeSource = response.data;
      this.mode = MODE.RESULT
    },
    initDate() {
      const today = new Date()
      const formatToday = UTIL.formatDate(Date.parse(today), 3)
      const startDate = UTIL.longLongAgo(formatToday, 30-1)
      this.dateDisplay = startDate + "~" + formatToday
      this.journeyParam.to_time = Date.parse(formatToday) // new Date(Date.parse((formatToday).replace(/-/g,"/"))).getTime()
      this.journeyParam.from_time = Date.parse(startDate) // incase fill zero bug
    }
  },
  async mounted() {
    this.topBcnRoot.icon = 'fa-paper-plane'
    this.topBcnRoot.name = '客户旅程'
    this.topBcnRoot.link = ''
    this.topBcnSecond.name = this.$route.query.name
    this.topBcnSecond.link = ''
    this.initDate()
    await Promise.all([this.getJourneyDetail(), this.getJourneyIndicator()])

    this.$refs.journey_view.$el.scrollTop = 150 // Make display in center only
    this.$refs.journey_view.$el.scrollLeft = 200 // Delete after 9.5
  }
}
</script>
