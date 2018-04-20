<style lang="scss" scoped>
@import "~vars";

.single-trans-overview {
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
        min-height: 600px;
      }
    }
  }
  .trans-info {
    li {
      font-size: 14px;
      padding: 2px;
      width: 100%;
      > ul{
        display: table;
        width: 100%;
        li {
          display: table-cell;
          vertical-align: middle;
          word-break:break-all;
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
      transition: .25s;
    }
    .panel-item-name {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      line-height: 26px;
      white-space:nowrap;
      text-overflow:ellipsis;
      word-break:break-all;
      overflow: hidden;
    }
    &:hover {
      cursor: pointer;
      .arrow {
        opacity: 1;
      }
    }
  }
  .el-dialog__wrapper{
    background-color: #f7f7f7;
  }
}
</style>
<template>
<div class="single-trans-overview common-container no-border" ref="loadingContainer">
  <div class="multiple">
      <div class="l">
        <div class="header-title tabstyle">
          <span class="title-name">基本信息</span>
        </div>
        <div class="content">
          <ul class="trans-info">
            <li>
              <ul>
                <li>用户体验：</li>
                <li>{{apdexTitle}}<i :title="apdexTitle" class="icon-apdex" :class="apdexIconClass"></i></li>
              </ul>
            <li>
              <ul>
                <li>事务名称：</li>
                <li>{{transInfo.transName}}</li>
              </ul>
            </li>
            <li>
              <ul>
                <li>响应时间：</li>
                <li>{{transInfo.responseTime}} ms</li>
              </ul>
            </li>
            <li>
              <ul>
                <li>发生时间：</li>
                <li>{{transInfo.startTime}}</li>
              </ul>
              </li>
          </ul>
        </div>
        <div class="header-title tabstyle">
          <span class="title-name">潜在风险</span>
        </div>
        <div class="content">
          <div class="panel" v-for="(danger, index) in dangers" :key="index"  @click="openTab(danger)">
            <p>
              <i class="icon-snapshot" :class="convertDanger(danger).iconCls"></i>
              <small class="title">{{convertDanger(danger).tag}}</small>
              <small class="time" v-if="danger.type !== 'ERROR'">{{danger.componentTime}} ms</small>
              <small class="arrow">
                <i class="theme-font-icon-color-weak ion-chevron-right"></i>
              </small>
              </p>
            <a href="javascript:void(0);">
              <span class="panel-item-name">{{danger.componentName}}</span>
              <el-progress
                v-if="danger.type !== 'ERROR'"
                :text-inside="true"
                :stroke-width="8"
                :show-text="false"
                :percentage="transInfo.responseTime>0?Math.floor(danger.componentTime / (transInfo.responseTime) * 10000) / 100 : 100"></el-progress>
            </a>
          </div>
        </div>
      </div>
      <div class="r">
        <div class="header-title tabstyle">
          <span class="title-name">拓扑图</span>
          <div class="right-info">
            <a href="javascript:void(0)" @click="setFullScreen"><i class="icon ion-android-expand"></i></a>
          </div>
        </div>
        <div class="content" ref="topoContainer">
          <Topo
            :fullbtnDisplay="topo.fullbtnDisplay"
            :data="topo.data"
            :update="topo.update"
            :attachmentSummary="topo.attachmentSummary"
            :setFullScreen="fullScreen"
            @onMouseUpNode="onMouseUpNode"
            @onFullScreenChange="onFullScreenChange"
            key="single-trans-overview"
            >
            </Topo>
        </div>
      </div>
  </div>
  <el-dialog size="large" :modal="false"  title="事务列表" :visible.sync="dialogTransTableVisible" >
    <el-table :data="transGridData">
      <el-table-column property="apdex" label="用户体验" width="100">
        <template slot-scope="scope">
          <i
          class="icon-health icon-row"
          :class="convertApdex(scope.row.apdex).apdexIconClass"
          :title="apdexTitle"></i>
          {{convertApdex(scope.row.apdex).apdexTitle}}
        </template>
      </el-table-column>
      <el-table-column property="transName" label="事务名称" width="200">
        <template slot-scope="scope">
          <a class="theme-font-color-primary" href="javascript:void(0);" @click="openTab(scope.row)">{{scope.row.transName}}</a>
        </template>
      </el-table-column>
      <el-table-column property="agentName" label="实例"></el-table-column>
      <el-table-column property="type" label="类型"></el-table-column>
      <el-table-column property="startTime" label="发生时间"></el-table-column>
      <el-table-column property="responseTime" label="响应时间(ms)"></el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>

<script>
import {apdexConverter} from '_cbl'
import Topo from '_topo/topo'
import TopoLayout from '_topo/topo-layout'
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import { Table, Button, TableColumn, Tag, Progress, Dialog } from 'element-ui'
export default {
  mixins: [TabMixin, loadingMixin],
  data() {
    return {
      fullScreen: false,
      transInfo: {
        apdex: '',
        transName: '',
        responseTime: 0,
        startTime: ''
      },
      dangers: [],
      topo: {
        layout: 'grid',
        update: 0,
        data: {},
        fullbtnDisplay: false,
        nodeTip: {
          show: false,
          left: 0,
          top: 0
        },
        attachmentSummary: {
          show: true,
          formatter: node => {
            return this.nodeSummary(node)
          },
          position: 'left'
        }
      },
      transGridData: [],
      dialogTransTableVisible: false,
      apdexIconClass: '',
      apdexTitle: '',
      totalElapsedTime: 0
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'table-tree': require('_ui-mod/table-tree'),
    'el-button': Button,
    'el-tag': Tag,
    'el-progress': Progress,
    'el-dialog': Dialog,
    Topo
  },
  watch: {
    'transInfo.apdex'(v) {
      if (v) {
        var apdex = this.convertApdex(v)
        this.apdexIconClass = apdex.apdexIconClass
        this.apdexTitle = apdex.apdexTitle
      }
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    setFullScreen() {
      this.fullScreen = true
    },
    onFullScreenChange(v) {
      this.fullScreen = v
    },
    reload() {
      this.transInfo.transName = this.options.queryStr
      this.init()
    },
    init() {
      let vm = this
      vm.loading = true
      Promise.all([
        // 获取基本信息
        vm.getSingleTransInfo(),
        // 获取潜在风险
        vm.getSingleTransDangers(),
        vm.getTopoData()
      ]).then(function() {
        vm.formatDangerData(arguments[0][1].data)
        vm.formatTopoData(arguments[0][2].data)
        vm.loading = false
      })
    },
    formatDangerData(data) {
      let vm = this
      if (data && data.length > 0) {
        data.forEach(item => {
          item.per = Math.floor(item.componentTime / (vm.transInfo.responseTime) * 10000) / 100
        })
      }
      vm.dangers = data
    },
    formatTopoData(data) {
      let vm = this
      if (data.links && data.links.length > 0) {
        vm.totalElapsedTime = vm.transInfo.responseTime
        data.links.forEach(link => {
          let per =
            Math.floor(link.elapsedTime / vm.totalElapsedTime * 10000) / 100
          link.label = `${link.elapsedTime}ms,${per}%`
          // 用户发出的线上不要显示文本信息
          if (link.source && link.source.type === 'USER') {
            link.label = ''
          }
        })
        data.nodes.forEach(node => {
          node.drillDown = node.type === 'SERVER'
          if (node.type === 'SERVER') {
            node.status = [
              { value: 1, name: vm.convertApdex(node.apdex).apdexStatus }
            ]
          }
        })
      }

      vm.topo.data = JSON.parse(JSON.stringify(data))
      var topoLayout = new TopoLayout()
      topoLayout.layout(vm.$refs.topoContainer, vm.topo.data)
      setTimeout(function() {
        vm.topo.update++
      }, 50)
    },
    nodeSummary(node) {
      let summary = []
      switch (node.type) {
        case 'USER':
          if (node.elapsedTime) {
            summary.push(`${node.elapsedTime} ms(100%)`)
          }
          if (node.error) {
            summary.push(`${node.error} errors`)
          }
          break
        case 'SERVER':
          if (node.elapsedTime) {
            summary.push(
              `${node.elapsedTime} ms(${Math.floor(
                node.elapsedTime / this.totalElapsedTime * 10000
              ) / 100}%)`
            )
          }
          let callCount = node.callCount
          summary.push(`${callCount} calls`)
          if (node.error) {
            summary.push(`${node.error} errors`)
          }
          break
        default:
          break
      }
      return summary
    },
    openTab(componentInfo) {
      let tab = {
        name: componentInfo.requestId,
        type: 'single-component-snapshot',
        options: componentInfo
      }

      this.$root.eventBus.openTab(tab)
    },
    componentUrlFormatter(componentInfo) {
      return Object.assign({}, componentInfo, {
        trans: encodeURIComponent(
          JSON.stringify({
            name: this.$route.name,
            query: this.$route.query
          })
        )
      })
    },
    getTopoData() {
      var vm = this
      return this.api.getSingleTransTopoList({
        data: {
          condition: vm.options
        }
      })
    },
    /**
       * 获取当前事务的基本信息
       */
    getSingleTransInfo() {
      let that = this
      return that.api.getSingleTransInfo({
        data: {
          condition: {
            traceId: that.options.traceId
          }
        },
        success(res) {
          if (res.code !== 0) return
          that.transInfo = res.data
        }
      })
    },
    getSingleTransDangers() {
      let that = this
      return that.api.getSingleTransDangers({
        data: {
          condition: {
            traceId: that.options.traceId
          }
        }
      })
    },
    onMouseUpNode(node, e) {
      let that = this
      if (node.type !== 'SERVER' || node.callCount <= 0) return

      return that.api.getSingleTransTopoNodeList({
        data: {
          condition: {
            traceId: that.options.traceId,
            tierId: node.id
          }
        },
        success(res) {
          if (res.code !== 0) return
          if (res.data && res.data.length > 0) {
            if (res.data && res.data.length > 0) {
              res.data.forEach(item => {
                item.traceId = that.options.traceId
                item.tierId = node.id
                item.tierName = node.showName
              })

              if (res.data.length === 1) {
                that.openTab(res.data[0])
              } else {
                that.transGridData = res.data
                that.dialogTransTableVisible = true
              }
            }
          }
        }
      })
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

