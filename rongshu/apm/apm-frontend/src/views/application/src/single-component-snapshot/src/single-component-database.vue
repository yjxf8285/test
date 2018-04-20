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
      <el-table :data="databaseList" stripe style="width: 100%">
        <el-table-column prop="databaseType" label="类型" width="150"></el-table-column>
        <el-table-column prop="sql" label="详情" >
          <template slot-scope="scope">
            <div :title="scope.row.sql" style="{
                   overflow: hidden;
                   text-overflow: ellipsis;
                   word-wrap: break-word;
                   display: -webkit-box;
                   -webkit-line-clamp: 3;
                   -webkit-box-orient: vertical;
            }">{{scope.row.sql}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dbParam" label="sql参数"></el-table-column>
        <el-table-column prop="callCount" label="调用次数" width="120"></el-table-column>
        <el-table-column prop="totalTime" label="总耗时(ms)" width="120"></el-table-column>
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
      databaseList: []
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
      that.api.getSingleComponentDataBaseList({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          that.databaseList = res.data
        },
        complete() {
          that.loading = false
        }
      })
    }
  }
}
</script>

