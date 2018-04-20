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
      <el-table :data="databaseRemoteDataList" stripe style="width: 100%">
        <el-table-column prop="type" width="200" label="类型"></el-table-column>
        <el-table-column prop="callFrom" label="调用来源"></el-table-column>
        <el-table-column prop="callTo" label="调用去向"></el-table-column>
        <el-table-column prop="details" label="详情">
          <template slot-scope="scope">
            <div :title="scope.row.details" style="{
                   overflow: hidden;
                   text-overflow: ellipsis;
                   word-wrap: break-word;
                   display: -webkit-box;
                   -webkit-line-clamp: 3;
                   -webkit-box-orient: vertical;
            }">{{scope.row.details}}
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="callCount" width="100" label="调用次数"></el-table-column>
        <el-table-column prop="elapsedTime" width="100" label="总耗时(ms)">
          <template slot-scope="scope">
            {{(+scope.row.elapsedTime).toFixed(2)}}
          </template>
        </el-table-column>
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
      databaseRemoteDataList: []
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
      that.api.getSingleTransDatabaseRemoteDataList({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          that.databaseRemoteDataList = res.data
        },
        complete() {
          that.loading = false
        }
      })
    }
  }
}
</script>

