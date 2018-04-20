<style lang="scss" scoped>
@import "~vars";
.table-box {
  height: 100%;
  padding: $marginWidth;
}
.icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0px 3px;
  background-repeat: no-repeat;
  background-size: 100%;
}

.icon-remote {
  background-image: url(../../../../../../static/images/cloud.png);
}
.icon-database {
  background-image: url(../../../../../../static/images/database.png);
}
</style>
<template>
    <div class="table-box" ref="loadingContainer">
      <el-table :data="dataList">
        <el-table-column label="层">
          <template slot-scope="scope">
            <i title="正常" v-if="scope.row.health==='NORMAL'" class="icon-apdex icon-apdex-normal"></i>
            <i title="缓慢" v-if="scope.row.health==='SLOW'" class="icon-apdex icon-apdex-slow"></i>
            <i title="非常慢" v-if="scope.row.health==='VERY_SLOW'" class="icon-apdex icon-apdex-very-slow"></i>
            <i title="错误" v-if="scope.row.health==='ERROR'" class="icon-apdex icon-apdex-error"></i>
            {{scope.row.tierName}}
          </template>
        </el-table-column>
        <el-table-column prop="nodeName" label="节点"></el-table-column>
        <el-table-column prop="transactionTime" width="100" label="耗时(ms)"></el-table-column>
        <el-table-column :label="'调用链响应时间：' + fullConsumingTime + 'ms'">
          <template slot-scope="scope">
            <ul style="display:table;width: 100%">
              <li style="display: table-cell">
                <range-progress status="success" :show-text="true" :stroke-width="7" :items="scope.row.progress">
                </range-progress>
              </li>
              <li  style="display: table-cell;width: 50px;padding-left:2px;">
                {{fullConsumingTime > 0 ? Math.round(scope.row.transactionTime / fullConsumingTime * 10000) / 100 : 100}}%
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="strStringTime" width="150" label="开始时间"></el-table-column>
        <el-table-column width="100" label="来源">
          <template slot-scope="scope">
            {{scope.row.source=='-1'?'浏览器点击': scope.row.source}}
          </template>
        </el-table-column>
        <el-table-column type="index" width="100" label="附加信息">
          <div style="text-align:center;" slot-scope="scope">
              <span class="icon-container icon" v-if="scope.row.extra && scope.row.extra.dataBase" >
                <i title="数据库" class="icon theme-font-color-primary icon-database"></i>
              </span>
              <span class="icon-container icon" v-if="scope.row.extra && scope.row.extra.remote" >
                <i title="远程调用" class="icon theme-font-color-primary icon-remote"></i>
              </span>
            </div>
        </el-table-column>
      </el-table>
    </div>

</template>

<script>
import util from '_util'
import Progress from '_components/progress'
import TreeTable from '_components/tree-table/index.vue'
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import { Table, TableColumn } from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      fullConsumingTime: 0,
      firstStartTime: 0,
      dataList: []
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'range-progress': Progress,
    TreeTable
  },
  methods: {
    reload() {
      this.getSingleTransRemoteWaterfall()
    },
    /**
     * 获取当前事务的错误列表
     */
    getSingleTransRemoteWaterfall() {
      let that = this
      that.loading = true
      that.api.getSingleTransRemoteWaterfall({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          if (res.data && res.data.length > 0) {
            let rootStartTime = res.data[0].startTime
            that.fullConsumingTime = res.data[0].elapsedTime
            res.data.forEach(node => {
              that.formatNode(node, rootStartTime)
            })
          }
          that.dataList = that.plainNodes(res.data[0])
          console.log(that.dataList)
        },
        complete() {
          that.loading = false
        }
      })
    },
    formatNode(node, rootStartTime) {
      let that = this
      let progress = []
      let beginRemoteTime = node.startTime
      node.strStringTime = util.formatDate(node.startTime)
      let hasElasedTime = 0
      node.timeOffset = beginRemoteTime - rootStartTime
      let caculate = n => {
        return Math.round(n / that.fullConsumingTime * 10000) / 100
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          this.formatNode(child, rootStartTime)
          progress.push({
            offset: caculate(beginRemoteTime - rootStartTime),
            percentage: caculate(child.startTime - beginRemoteTime),
            status: 'success',
            text: ''
          })
          hasElasedTime += child.startTime - beginRemoteTime
          beginRemoteTime = child.endTime
        })
        if (hasElasedTime < node.transactionTime) {
          progress.push({
            offset: caculate(beginRemoteTime - rootStartTime),
            percentage: caculate(node.transactionTime - hasElasedTime),
            status: 'success',
            text: ''
          })
          // 为每个节点附加一个结束时间
          node.endTime = beginRemoteTime + node.transactionTime - hasElasedTime
        }
      } else {
        node.endTime = node.startTime + node.transactionTime
        progress.push({
          offset: caculate(beginRemoteTime - rootStartTime),
          percentage: caculate(node.transactionTime),
          status: 'success',
          text: ''
        })
      }
      node.progress = progress
    },
    plainNodes(node) {
      let vm = this
      let nodes = []
      let children = []
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          children = children.concat(vm.plainNodes(child))
        })
      }
      nodes.children = []
      nodes.push(node)
      nodes = nodes.concat(children)
      return nodes
    }
  }
}
</script>

