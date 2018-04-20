<style lang="scss">
  $green: #5bd4c7;
  $orange: #ffcc99;
  $lightred: #ff8f1f;
  $red: #ff1f1f;
  .remote {
    .au-panel.table-panel {
      margin: 16px;
      .au-panel-content {
        padding: 15px 15px 40px 15px;
      }
    }
  }
</style>

<template>
  <div class="remote">
    <top-bar title="远程调用" @barChange="barChange"></top-bar>
    <FilterBarSimple @fbarChange="fbarChange" ref="simplefilterbar"></FilterBarSimple>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-podium"></i>
        <span class="title-name">远程调用列表</span>
        <div class="seach-area fn-fr" style="padding:12px;">
          <el-input class="circular" v-model.trim="remoteAddress" placeholder="请输入内容"
                    size="mini"></el-input>
        </div>
      </div>
      <div class="content">
        <el-table :data="dataList" @sort-change="remoteListsortChange" stripe style="width: 100%">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column prop="name" label="远程调用">
            <template slot-scope="scope">
              <a class="theme-font-color-primary" href="javascript:void 0;"
                 @click="goToDetail(scope.row)">{{ scope.row.address }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="avgResponseTime" label="平均响应时间" sortable="custom"></el-table-column>
          <el-table-column prop="throughput" label="吞吐率(rpm)" sortable="custom"></el-table-column>
          <el-table-column prop="requestCount" label="请求数" sortable="custom"></el-table-column>
          <el-table-column prop="errorCount" label="错误数" sortable="custom"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {Popover, Pagination, Table, Input, TableColumn} from 'element-ui'
  import FilterBarSimple from '_components/filter-bar/filter-bar-simple.vue'
  import PercentBar from '_components/ui-mod/percent-bar.vue'
  import DataGrid from '_components/datagrid/index.vue'
  import topBarQuery from '../../../../../components/mixin/topBarQuery'

  export default {
    components: {
      'el-pagination': Pagination,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-input': Input,
      FilterBarSimple,
      Popover,
      PercentBar,
      DataGrid
    },
    mixins: [topBarQuery],
    data() {
      return {
        dataList: [],
        allDataList: [],
        remoteListField: 'avgResponseTime',
        remoteListOrder: 'desc',
        remoteAddress: '',
        dataGridConfig: {
          totalCount: 0,
          pagination: false,
          sort: {
            orderBy: '',
            rule: 'DESC'
          }
        }
      }
    },
    watch: {
      remoteAddress() {
        this.getRemoteList()
        this.$refs.simplefilterbar.reset()
      }
    },
    methods: {
      barChange(queryData) {
        this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
        this.getRemoteList()
      },
      fbarChange(condition) {
        this.dataList = this.handleFilterData(condition, this.allDataList)
      },
      handleFilterData(condition, dataList) {
        let res = []
        for (let conditionKey in condition) {
          if (conditionKey !== 'keyword') {
            condition[conditionKey] = condition[conditionKey] || -1
          }
        }
        if (
          // condition.keyword.length === 0 &&
          condition.avgResponseTime === 0 &&
          condition.rpm === 0 &&
          condition.errorNum === 0
        ) {
          res = dataList
        } else {
          dataList.map(m => {
            if (
              m.address.search(condition.keyword) >= 0 &&
              Number(condition.avgResponseTime) < Number(m.avgResponseTime) &&
              Number(condition.rpm) < Number(m.throughput) &&
              Number(condition.errorNum) < Number(m.errorCount)
            ) {
              res.push(m)
            }
          })
        }
        return res
      },
      remoteListsortChange(sortObj) {
        // switch (sortObj.prop) {
        //   case 'timeSpentRatio':
        //     this.remoteListField = 'sum_response_time'
        //     break
        //   case 'avgResponseTime':
        //     this.remoteListField = 'avgResponseTime'
        //     break
        //   case 'requestCount':
        //     this.remoteListField = 'call_times'
        //     break
        //   case 'throughput':
        //     this.remoteListField = 'sum_throughput'
        //     break
        // }
        this.remoteListField = sortObj.prop || 'avgResponseTime'
        switch (sortObj.order) {
          case 'ascending':
            this.remoteListOrder = 'asc'
            break
          case 'descending':
            this.remoteListOrder = 'desc'
            break
        }
        this.getRemoteList()
      },
      getRemoteList() {
        this.api
          .getRemoteList({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                address: this.remoteAddress,
                size: 100
              },
              sort: {
                // 必选
                field: this.remoteListField, // avgResponseTime、throughput、requestCount、errorCount
                order: this.remoteListOrder // 必选，可以是 asc和desc
              }
            }
          })
          .then(res => {
            if (res.code === 0) {
              this.dataList = res.data || []
              this.allDataList = _.cloneDeep(res.data)
            }
          })
      },
      goToDetail(row) {
        // 跳转的时候要把tier信息带过去
        Object.assign(row, {
          tierId: this.$route.query.tierId || '',
          instanceToken: this.$route.query.instanceToken || ''
        })
        this.$router.push({
          name: 'remote-detail',
          query: row
        })
      }
    }
  }
</script>
