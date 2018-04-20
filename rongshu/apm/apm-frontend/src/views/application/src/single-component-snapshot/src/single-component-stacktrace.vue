<style lang="scss" scoped>
@import "~vars";
.table-box {
  height: 100%;
  overflow: auto;
  position: relative;
  padding: $marginWidth;
  padding-top: 0px;
}
.icon {
  display: inline-block;
  font-size: 12px;
  width: 14px;
  height: 14px;
  background-repeat: no-repeat;
  background-size: 100%;
}
.icon-remote {
  background-image: url(../../../../../../static/images/cloud.png);
}
.icon-database {
  background-image: url(../../../../../../static/images/database.png);
}
.header {
  left: 0px;
  bottom: 0px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 10px 0px #ccc;
  .toolbar {
    list-style: none;
    padding: 10px;
    float: right;
    li {
      display: inline-block;
      margin-right: 10px;
      line-height: 20px;
      height: 20px;
      .tag {
        display: inline-block;
        background-color: #5b97fb;
        vertical-align: middle;
        margin-right: 2px;
        margin-bottom: 2px;
        border-radius: 2px;
        width: 25px;
        height: 12px;
        &.self {
          background-color: #29ca8e;
        }
      }
    }
  }
}
.error {
  color: #ff0000;
}
</style>
<template>
    <div class="table-box" ref="loadingContainer">
      <div class="header">
        <ul class="toolbar">
          <li><span class="tag self"></span>自身耗时</li>
          <li><span class="tag"></span>调用耗时</li>
        </ul>
      </div>
      <TreeTable :treeNodeColumnWidth="'50%'" :columns="columns" :nodes="dataList">
        <template slot="node" slot-scope="scope">
          <span class="error" v-if="scope.row.value.error">
            <a href="javascript: void(0);" @click="gotoComponentTab('single-component-error-detail', scope.row.value)">
              <i title="错误" class="icon-apdex icon-apdex-error"></i>
              {{scope.row.value.name}}
            </a>
          </span>
          <span v-else>
            {{scope.row.value.name}}
          </span>
        </template>
        <template slot="columns" slot-scope="scope">
          <td style="width:100px;">{{scope.row.value.timeOffset}}</td>
          <td style="width:100px;">{{scope.row.value.internalTimeSpend + scope.row.value.callTimeSpend}}</td>
          <td style="width:100px;">{{scope.row.value.selfElapsed}}</td>
          <td>
            <div style="padding-right: 35px;">
            <range-progress status="success" :show-text="true" :stroke-width="7" :items="scope.row.value.progress">
            </range-progress>
            {{scope.row.value.totalTimeSpend?
              Math.round((scope.row.value.internalTimeSpend + scope.row.value.callTimeSpend) / scope.row.value.totalTimeSpend * 10000) / 100:
              0}}%
            </div>
          </td>
          <td style="text-align:center;width: 80px;">
            <i @click="gotoComponentTab('single-component-remote', scope.row.value)" title="远程调用" v-if="scope.row.value.type==='REMOTE'" class="icon theme-font-color-primary icon-remote"></i>
            <i @click="gotoComponentTab('single-component-database', scope.row.value)" title="数据库" v-if="scope.row.value.type==='DATABASE'" class="icon theme-font-color-primary icon-database"></i>
          </td>
        </template>
      </TreeTable>

    </div>

</template>

<script>
import Progress from '_components/progress'
import TreeTable from '_components/tree-table/index.vue'
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'

import { Table, TableColumn } from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      dataList: [],
      columns: [
        { text: '堆栈', value: 'name', isTreeNode: true },
        { text: '偏移量(ms)', value: 'timeOffset' },
        { text: '耗时(ms)', value: 'callTimeSpend' },
        { text: '自身耗时(ms)', value: 'selfElapsed' },
        { text: '耗时百分比', value: 'callTimeSpend' },
        { text: '附加信息', value: 'type' }
      ]
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    TreeTable,
    'range-progress': Progress
  },
  methods: {
    reload() {
      this.getTraceStackData()
    },
    /**
     * 获取当前事务的错误列表
     */
    getTraceStackData() {
      let that = this
      that.loading = true
      that.api.getComponentSnapshotStacks({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          if (res.data && res.data.length > 0) {
            res.data.forEach(node => {
              that.formatNode(node)
            })
          }
          that.dataList = res.data
        },
        complete() {
          that.loading = false
        }
      })
    },
    formatNode(node) {
      let progress = []
      let caculate = n => {
        return node.totalTimeSpend
          ? Math.round(n / node.totalTimeSpend * 10000) / 100
          : 0
      }

      progress.push({
        offset: caculate(node.timeOffset),
        percentage: caculate(node.internalTimeSpend + node.callTimeSpend),
        status: 'success',
        text: ''
      })

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          progress.push({
            offset: caculate(child.timeOffset),
            percentage: caculate(child.internalTimeSpend + child.callTimeSpend),
            status: 'exception',
            text: ''
          })
          this.formatNode(child)
        })
      } else {
        progress.push({
          offset: caculate(node.timeOffset + node.internalTimeSpend),
          percentage: caculate(node.callTimeSpend),
          status: 'exception',
          text: ''
        })
      }
      node.progress = progress
    },
    gotoComponentTab(to, item) {
      if (to !== 'single-component-error-detail') {
        this.$emit('switch-tab', to, {})
      } else {
        this.$emit('switch-tab', to, { error: item.id })
      }
    }
  }
}
</script>

