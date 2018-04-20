<style lang="scss" scoped>
@import "~vars";
.table-box {
  height: 100%;
  overflow: auto;
  position: relative;
  padding: $marginWidth;
}
</style>
<template>
    <div class="table-box" ref="loadingContainer">
      <StackedBarChart :height="150" :show-header="false" :show-border="false" :yAxisCategoryText="'耗时'" :data="chartData"></StackedBarChart>
      <el-table :data="detailData" stripe style="width: 100%;" class="mt20">
        <el-table-column prop="name" label="组件详情"></el-table-column>
        <el-table-column prop="callCount" label="调用次数" width="120"></el-table-column>
        <el-table-column prop="timeSpend" label="自身耗时(ms)" width="120"></el-table-column>
        <el-table-column label="占比" width="120">
          <template slot-scope="scope">
            {{totalTime > 0 ? Math.floor(scope.row.timeSpend / totalTime * 10000) / 100: 100}}%
          </template>
        </el-table-column>
      </el-table>
    </div>

</template>

<script>
import StackedBarChart from '_charts/chart-stacked-bar.vue'
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import { Table, TableColumn } from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      legentMaxLength: 50,
      totalTime: 0,
      detailData: []
    }
  },
  computed: {
    chartData() {
      let vm = this
      let data = []
      let another = { name: '其他', value: 0 }
      vm.totalTime = 0
      if (vm.detailData && vm.detailData.length > 0) {
        vm.detailData.forEach((item, index) => {
          if (index < vm.legentMaxLength) {
            data.push({
              name: item.name,
              value: item.timeSpend
            })
          } else {
            another.value += item.timeSpend
          }
          vm.totalTime += item.timeSpend
        })
        if (another.value > 0) {
          data.unshift(another)
        }
        data = _.sortBy(data, ['value']).reverse()
        data.forEach(item => {
          item.value =
            vm.totalTime > 0
              ? Math.floor(item.value / vm.totalTime * 10000) / 100
              : 100
        })
      }
      return data
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    StackedBarChart
  },
  methods: {
    reload() {
      this.getComponentSnapshotDetail()
    },
    /**
     * 获取当前事务的错误列表
     */
    getComponentSnapshotDetail() {
      let that = this
      that.loading = true
      that.api.getComponentSnapshotDetail({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          let data = res.data
          if (data && data.length > 0) {
            that.detailData = _.sortBy(data, ['timeSpend']).reverse()
          }
        },
        complete() {
          that.loading = false
        }
      })
    }
  }
}
</script>

