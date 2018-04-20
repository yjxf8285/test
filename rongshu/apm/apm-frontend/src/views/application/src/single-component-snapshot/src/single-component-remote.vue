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
      <el-table :data="remoteCallbackList" stripe style="width: 100%">
        <el-table-column prop="remoteAddress" label="远程接口"></el-table-column>
        <el-table-column prop="httpParam" label="调用参数"></el-table-column>
        <el-table-column prop="callCount" label="调用次数"></el-table-column>
        <el-table-column prop="totalTime" label="总耗时(ms)"></el-table-column>
      </el-table>
    </div>

</template>

<script>
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import { Table, TableColumn } from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      remoteCallbackList: []
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  methods: {
    reload() {
      this.getDatabaseRemoteData()
    },
    /**
     * 获取当前事务的错误列表
     */
    getDatabaseRemoteData() {
      let that = this
      that.loading = true
      that.api.getSingleComponentRemoteList({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          that.remoteCallbackList = res.data
        },
        complete() {
          that.loading = false
        }
      })
    }
  }
}
</script>

