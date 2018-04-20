
<style lang="scss" scoped>
.remote-detail {
  .common-container {
    .content {
      padding: 0px;
    }
  }
  .el-tabs__header {
    margin: 0px;
  }
  .f-r {
    float: right;
  }
}
</style>

<template>
  <div class="remote-detail">
    <top-bar :title="title" :showBack="true" @barChange="barChange"></top-bar>
    <FilterBarComplex
      v-if="filterListData.length>0"
      :filterList="filterListData"
      style="margin-top: 1px"
      @fbarChange="filterbarChange">
    </FilterBarComplex>
     <div class="common-container tab">
      <div class="content">
        <el-tabs v-model="currentTab" class="header-margin0">
          <el-tab-pane label="性能分析" name="performance">
            <RemotePerformance :condition="condition" :selected="currentTab==='performance'" />
          </el-tab-pane>
          <el-tab-pane label="错误分析" name="error">
            <RemoteError :condition="condition" :selected="currentTab==='error'" />
          </el-tab-pane>
          <el-tab-pane label="快照分析" name="snapshot">
            <RemoteSnapshot :condition="condition" :selected="currentTab==='snapshot'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
import {
  Popover,
  Pagination,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Input
} from 'element-ui'
import FilterBarComplex from '_components/filter-bar/filter-bar-complex.vue'
import PercentBar from '_components/ui-mod/percent-bar.vue'
import RemotePerformance from './remote-performance.vue'
import RemoteError from './remote-error.vue'
import RemoteSnapshot from './remote-snapshot.vue'
import topBarQuery from '../../../../../components/mixin/topBarQuery'
export default {
  components: {
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-input': Input,
    FilterBarComplex,
    Popover,
    PercentBar,
    RemotePerformance,
    RemoteError,
    RemoteSnapshot
  },
  mixins: [topBarQuery],
  data() {
    return {
      title: '远程调用',
      url: '',
      queryData: this.$route.query,
      currentTab: 'performance',
      fiterBarData: [],
      topBarData: [],
      condition: {},
      filterListData: [
        {
          text: '调用者',
          disable: false,
          type: 1,
          itemId: 'invokerArray',
          listData: []
        },
        {
          text: '错误类型',
          disable: false,
          type: 1,
          itemId: 'errorArray',
          listData: []
        }
      ]
    }
  },
  computed: {
    errorArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'errorArray') &&
          this.fiterBarData
            .find(m => m.itemId === 'errorArray')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    invokerArray() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'invokerArray') &&
          this.fiterBarData
            .find(m => m.itemId === 'invokerArray')
            .infoData.map(m => m.value)) ||
        []
      )
    },
    responseTime() {
      return (
        (this.fiterBarData.find(m => m.itemId === 'responseTime') &&
          this.fiterBarData
            .find(m => m.itemId === 'responseTime')
            .infoData.map(m => m.value)) ||
        []
      )
    }
  },
  mounted() {
    this.url = this.queryData.address
    this.title = `远程调用 > ${this.queryData.address}`
  },
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.initFilterBar()
      this.reload()
    },
    filterbarChange(query) {
      this.fiterBarData = query
      this.reload()
    },
    initFilterBar() {
      this.getRemoteInitiators()
      this.getRemoteErrorTypes()
    },
    // 获取调用者
    getRemoteInitiators() {
      // 这个命名有问题！
      let vm = this
      return vm.api
        .getRemoteInitiators({
          // 这个命名有问题！
          data: {
            condition: {
              appId: this.appId,
              startTime: this.startTime,
              endTime: this.endTime,
              type: 3,
              size: 100
            }
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data || []
            vm.filterListData[0].listData = []
            data.forEach(item => {
              vm.filterListData[0].listData.push({
                id: item,
                name: item
              })
            })
          }
        })
    },
    // 获取错误类型
    getRemoteErrorTypes() {
      let vm = this
      return vm.api
        .getRemoteErrorTypes({
          data: {
            condition: {
              appId: this.appId,
              startTime: this.startTime,
              endTime: this.endTime,
              type: 3,
              size: 100
            }
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data || []
            vm.filterListData[1].listData = []
            data.forEach(item => {
              vm.filterListData[1].listData.push({
                id: item,
                name: item
              })
            })
          }
        })
    },
    reload() {
      let condition = {
        appId: this.appId,
        interval: this.interval,
        aggrInterval: this.aggrInterval,
        startTime: this.startTime,
        endTime: this.endTime,
        minResponseTime: this.responseTime[0],
        maxResponseTime: this.responseTime[1],
        spanTransaction: this.invokerArray,
        transaction: this.invokerArray,
        error: this.errorArray,
        callers: this.invokerArray,
        errorTypes: this.errorArray,
        uri: this.url,
        address: this.url
      }
      this.condition = condition
    }
  }
}
</script>
