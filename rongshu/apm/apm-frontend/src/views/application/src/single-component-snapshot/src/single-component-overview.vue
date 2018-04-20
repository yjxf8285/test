<style lang="scss" scoped>
@import "~vars";
.danger {
  color: red;
}
.single-component-overview {
  .content {
    margin-bottom: 16px;
    border-bottom: solid 1px #dcdcdc;
    &:last-child {
      border-bottom-width: 0px;
    }
  }
  .multiple {
    display: flex;
    border-bottom: 1px solid #dcdcdc;
    .l {
      padding-top: 15px;
      width: 400px;
    }
    .r {
      flex: 1;
      border-left: solid 1px #dcdcdc;
      padding-top: 15px;
      .content {
        margin-bottom: 0px;
        position: relative;
        width: 100%;
        height: 100%;
      }
    }
  }
  .trans-info {
    li {
      font-size: 14px;
      padding: 2px;
      width: 100%;
      > ul {
        display: table;
        width: 100%;
        li {
          display: table-cell;
          vertical-align: middle;
          word-break: break-all;
        }
        > li {
          width: 30%;
        }
        > li + li {
          width: 70%;
        }
      }
    }
  }

  .chart-wrap {
    position: absolute;
    top: 33px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
  .panel {
    margin-bottom: $marginWidth / 2;
    background-color: #f7f7f7;
    border: none;
    border-radius: 5px;
    padding: 10px;
    .title {
      padding-left: 5px;
      font-size: 14px;
      color: #333;
    }
    .time {
      color: #ff812e;
      font-size: 14px;
    }
    .arrow {
      float: right;
      margin-top: 3px;
      color: #333;
      opacity: 0;
      transition: 0.25s;
    }
    .panel-item-name {
      //display: inline-block;
      //width: 100%;
      font-size: 14px;
      line-height: 26px;
      // white-space:nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
    &:hover {
      cursor: pointer;
      .arrow {
        opacity: 1;
      }
    }
  }
}
</style>
<template>
<div class="single-component-overview common-container no-border" ref="loadingContainer">
  <div class="multiple">
      <div class="l">
        <div class="header-title tabstyle">
          <span class="title-name">基本信息</span>
        </div>
        <div class="content">
           <ul class="trans-info">
            <li v-for="(row, index) in localBasicInfo" :key="index">
              <ul>
                <li class="label">{{row.label}}：</li><li class="" v-if="row.key==='userExperience'">
                  {{convertApdex(row.value).apdexTitle}}<i :title="convertApdex(row.value).apdexTitle" class="icon-apdex" :class="convertApdex(row.value).apdexIconClass"></i>
                </li>
                <li v-else-if="row.key==='responseTime'">
                  {{row.value}} ms
                </li>
                <li v-else  :class="{'danger': row.httpStatus && row.httpStatus >= 400}">
                  {{row.value}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="header-title tabstyle">
          <span class="title-name">请求参数</span>
        </div>
        <div class="content">
          <ul class="trans-info">
          <li v-for="(row, index) in localRequestParam" :key="index">
            <ul>
            <li>{{row.key}}：</li>
            <li>
              {{row.value}}
            </li>
            </ul>
          </li>
          </ul>
        </div>
      </div>
      <div class="r">
        <div class="header-title tabstyle">
          <span class="title-name">潜在问题</span>
        </div>
        <div class="content">
          <div class="panel"
            v-for="(item, index) in localPotentialIssue"
            @click="gotoComponentTab(item)"
            :key="index">
            <p>
              <i class="icon-snapshot" :class="convertDanger(item).iconCls"></i>
              <small class="title" v-if="item.type !== 'ERROR'">{{convertDanger(item).tag}}</small>
              <small class="title" v-else>{{item.errorName}}</small>
              <small class="time"  v-if="item.type !== 'ERROR'">{{item.elapsedTime}} ms</small>
              <small class="arrow">
                <i class="theme-font-icon-color-weak ion-chevron-right"></i>
              </small>
              </p>
            <a href="javascript:void(0);" style="display: block;width:100%;">
              <span class="panel-item-name" v-if="item.type !== 'ERROR'">{{item.name}}</span>
              <div class="panel-item-name" v-else>{{item.errorMessage}}</div>
              <el-progress
                v-if="item.type !== 'ERROR'"
                :text-inside="true"
                :stroke-width="8"
                :show-text="false"
                :percentage="item.percentage"></el-progress>
            </a>
          </div>
        </div>
      </div>
  </div>
</div>
</template>

<script>
import util from '_util'
import { apdexConverter } from '_cbl'
import Topo from '_topo/topo'
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import {
  Table,
  Button,
  TableColumn,
  Row,
  Col,
  Tag,
  Progress
} from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      data: {
        basicInfo: {},
        requestParam: {},
        potentialIssue: {}
      },
      kvs: [
        ['slowestModule', '缓慢组件', 'single-component-stacktrace', 'SERVER'],
        [
          'slowestSqlRequest',
          '缓慢SQL请求',
          'single-component-database',
          'DATABASE'
        ],
        [
          'slowestRemoteInvocation',
          '缓慢远程调用',
          'single-component-remote',
          'REMOTE'
        ],
        ['errorSummary', '错误摘要', 'single-component-error-detail', 'ERROR']
      ]
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'table-tree': require('_ui-mod/table-tree'),
    'el-button': Button,
    'el-row': Row,
    'el-col': Col,
    'el-tag': Tag,
    'el-progress': Progress,
    Topo
  },
  computed: {
    localPotentialIssue() {
      let locals = []
      let vm = this
      vm.kvs.forEach(kv => {
        let items = vm.data.potentialIssue[kv[0]]
        if (items && items.length > 0) {
          items.forEach(item => {
            let total = vm.data.basicInfo.responseTime
            if (item.elapsedTime) {
              item.percentage = Math.floor(item.elapsedTime / total * 100)
            }
            locals.push(Object.assign({}, item, { text: kv[1], type: kv[3] }))
          })
        }
      })
      return locals
    },
    localRequestParam() {
      if (this.data.requestParam && this.data.requestParam.params) {
        return Object.keys(this.data.requestParam.params).map(item => {
          return { key: item, value: this.data.requestParam.params[item] }
        })
      }
      return []
    },
    localBasicInfo() {
      let that = this
      let basicInfo = [
        { key: 'userExperience', value: '', label: '用户体验' },
        { key: 'transaction', value: '', label: '事务名称' },
        { key: 'responseTime', value: '', label: '响应时间' },
        { key: 'occurTime', value: '', label: '发生时间' },
        { key: 'instanceInfo', value: '', label: '实例名称' },
        { key: 'tierName', value: '', label: '层' },
        { key: 'transactionType', value: '', httpStatus: 0, label: '事务类型' }
      ]
      if (that.data.basicInfo) {
        basicInfo.forEach(item => {
          item.value = that.data.basicInfo[item.key]
          if (item.key === 'transactionType') {
            var result = /^HTTP\(([0-9]+)\)/i.exec(
              that.data.basicInfo[item.key]
            )
            if (result) {
              item.httpStatus = +result[1]
            } else {
              item.httpStatus = 0
            }
          }
        })
      }
      return basicInfo
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.getComponentSnapshotOverview()
    },
    getComponentSnapshotOverview() {
      let that = this
      that.loading = true
      that.api.getComponentSnapshotOverview({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          that.data = res.data
          if (that.data.basicInfo.occurTime) {
            that.data.basicInfo.occurTime = util.formatDate(
              that.data.basicInfo.occurTime
            )
          }
        },
        complete() {
          that.loading = false
        }
      })
    },
    caculatePercentage(cur) {
      let total = this.data.basicInfo.responseTime
      return Math.floor(cur / total * 100)
    },
    gotoComponentTab(item) {
      let to = this.kvs.filter(k => {
        return k[1] === item.text
      })[0][2]
      if (to !== 'single-component-error-detail') {
        this.$emit('switch-tab', to, {})
      } else {
        this.$emit('switch-tab', to, { error: item.id })
      }
    },
    convertApdex(v) {
      return apdexConverter(v)
    },
    convertDanger(v) {
      let result = {}
      switch (v.type) {
        case 'SERVER':
          result.tag = '缓慢组件'
          result.iconCls = 'icon-snapshot-server'
          break
        case 'DATABASE':
          result.tag = '缓慢SQL请求'
          result.iconCls = 'icon-snapshot-database'
          break
        case 'ERROR':
          result.tag = '错误摘要'
          result.iconCls = 'icon-snapshot-error'
          break
        case 'REMOTE':
          result.tag = '缓慢远程调用'
          result.iconCls = 'icon-snapshot-component'
          break
      }
      return result
    }
  }
}
</script>

