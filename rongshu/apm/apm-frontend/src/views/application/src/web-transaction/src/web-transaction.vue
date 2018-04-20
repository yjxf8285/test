<style lang="scss" scoped>
.table-box {
  position: relative;
}

.topn-tit {
  font-size: 14px;
  float: left;
  margin-top: 10px;
}

.search-input {
  float: right;
  width: 200px;
}
</style>
<template>
  <div class="web-transaction">
    <top-bar @barChange="barChange"></top-bar>
    <div class="page-container">
      <div class="topn-tablelist">
        <div class="clearfix">
          <div class="topn-tit">TopN 应用慢事务</div>
          <el-input placeholder="请输入名称"  size="small" class="search-input"
                    v-model="topNchartData.searchName" @change="handleSearchTopn"></el-input>
        </div>
        <div class="table-box" ref="tableContainer">
          <el-table
            :data="topNchartData.data"
            stripe
            style="width: 100%" class="mt10">
            <el-table-column
              type="index"
              width="100"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称">
              <template slot-scope="scope">
                <a class="theme-font-color-primary" href="javascript:void 0;"
                   @click="goToNextPage(scope.row.name)">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="max"
              label="最大值">
            </el-table-column>
            <el-table-column
              prop="min"
              label="最小值">
            </el-table-column>
            <el-table-column
              prop="avg"
              label="平均值">
            </el-table-column>
            <el-table-column
              prop="count"
              label="发生次数">
            </el-table-column>
          </el-table>
        </div>
        <div class="pag-wrap">
          <el-pagination
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="topNchartData.size"
            :total="topNchartData.total">
          </el-pagination>
        </div>
      </div>
      <!--<cm-bar class="mt20"-->
      <!--:loading="topNchartData.loading"-->
      <!--:queryData="queryData"-->
      <!--:data="topNchartData.data"-->
      <!--:title="topNchartData.title"-->
      <!--:optionData="op"-->
      <!--:link="topNchartData.link"-->
      <!--&gt;</cm-bar>-->
      <cm-line
        :loading="topNLineData.loading"
        :data="topNLineData.data"
        :title="topNLineData.title"
      ></cm-line>
      <cm-line
        :loading="countLineData.loading"
        :data="countLineData.data"
        :title="countLineData.title"
      ></cm-line>
      <cm-line
        :loading="avgLineData.loading"
        :data="avgLineData.data"
        :title="avgLineData.title"
      ></cm-line>
      <h4 class="mt20">应用事务列表</h4>
      <div class="table-box" ref="tableContainer">
        <el-table
          :data="affairList.data"
          stripe
          style="width: 100%" class="mt20">
          <el-table-column
            type="index"
            width="100"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="事务">
            <template slot-scope="scope">
              <a class="theme-font-color-primary" href="javascript:void 0;"
                 @click="affairListClick(scope.row.name)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="avg"
            label="平均响应耗时(ms)">
          </el-table-column>
          <el-table-column
            prop="count"
            label="发生次数">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'

import {
  Table,
  TableColumn,
  Button,
  Pagination,
  Input,
  Loading
} from 'element-ui'

export default {
  name: 'web-transaction',
  data() {
    return {
      id: 0,
      op: {},
      queryData: {
        interval: '',
        systemId: '',
        groupId: '',
        agentId: ''
      },
      topNchartData: {
        total: 0,
        size: 5,
        searchName: '',
        loading: false,
        title: 'Top5 应用慢事务',
        link: this.$route.query.tierId
          ? 'tier-web-slow-transaction-satisfy'
          : 'web-slow-transaction-satisfy',
        allData: [], // 因为后端不提供分页和搜索功能，这里要保存所有的数据
        data: [] // 当前显示的数据
      },
      topNLineData: {
        loading: false,
        title: 'Top5 应用慢事务响应时间',
        data: {}
      },
      countLineData: {
        loading: false,
        title: 'WEB应用吞吐率',
        data: {}
      },
      avgLineData: {
        'el-table': Table,
        'el-table-column': TableColumn,
        'el-button': Button,
        loading: false,
        title: 'web应用平均响应时间',
        data: {}
      },
      affairList: {
        data: [],
        loading: false,
        loadingInstance: null
      }
    }
  },
  components: {
    'el-table': Table,
    'el-input': Input,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-pagination': Pagination,
    'cm-bar': require('_charts/topn-bar'),
    'cm-line': require('_charts/chart-lines')
  },
  watch: {
    'affairList.loading'(v) {
      if (v) {
        this.affairList.loadingInstance = Loading.service({
          target: this.$refs.tableContainer
        })
      } else {
        if (this.affairList.loadingInstance) {
          this.affairList.loadingInstance.close()
          this.affairList.loadingInstance = null
        }
      }
    }
  },
  methods: {
    barChange(obj) {
      this.queryData = {
        interval: obj[0].id,
        systemId: obj[1].id,
        groupId: obj[2].id,
        agentId: obj[3].id
      }
      this.getTopNData()
    },
    goToNextPage(name) {
      let vm = this
      let link = this.$route.query.tierId
        ? 'tier-web-slow-transaction-satisfy'
        : 'web-slow-transaction-satisfy'
      vm.$router.push({
        name: link,
        query: Object.assign(
          {},
          vm.$route.query,
          {
            queryStr: name
          },
          vm.queryData
        )
      })
    },
    getParams: function() {
      let params = this.$route.params
      this.id = params.id
    },
    affairListClick(name) {
      this.$router.push({
        name: this.$route.query.tierId
          ? 'tier-web-slow-transaction-satisfy'
          : 'web-slow-transaction-satisfy',
        query: Object.assign(
          {},
          this.$route.query,
          {
            queryStr: name
          },
          this.queryData
        )
      })
    },
    getTopNData() {
      let that = this
      let topNchartData = this.topNchartData
      let oData = Object.assign(
        {
          size: 10
        },
        this.queryData
      )
      this.api.getSpanQueryTop({
        data: Object.assign(oData, {
          size: 100
        }),
        beforeSend() {
          topNchartData.loading = true
        },
        complete() {
          topNchartData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          topNchartData.allData = res.data
          topNchartData.data = util.pagingData(
            0,
            topNchartData.size,
            topNchartData.allData
          )
          topNchartData.total = res.data.length
          topNchartData.loading = false
        }
      })
      this.api.getTopLineChart({
        data: Object.assign({}, oData, {
          size: 5
        }),
        beforeSend() {
          that.topNLineData.loading = true
        },
        complete() {
          that.topNLineData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          that.topNLineData.data = res
        }
      })
      this.api.getWebTransactionTps({
        data: Object.assign({}, oData),
        beforeSend() {
          that.countLineData.loading = true
        },
        complete() {
          that.countLineData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          that.countLineData.data = res
        }
      })
      this.api.getWebTransactionAvgResponseTime({
        data: Object.assign({}, oData),
        beforeSend() {
          that.avgLineData.loading = true
        },
        complete() {
          that.avgLineData.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          that.avgLineData.data = res
        }
      })

      this.api.getSpanWebTranList({
        data: oData,
        beforeSend() {
          that.affairList.loading = true
        },
        complete() {
          that.affairList.loading = false
        },
        success(res) {
          if (res.code !== 0) return
          res.data.map(m => {
            m.avg = util.toDecimal(m.avg, 3)
          })
          that.affairList.data = res.data
        }
      })
    },
    handleSearchTopn(keyWord) {
      let topnData = this.topNchartData.allData
      let resData = topnData.filter(m => m.name.search(keyWord) >= 0)
      this.topNchartData.data = util.pagingData(
        0,
        this.topNchartData.size,
        resData
      )
      this.topNchartData.total = resData.length
    },
    handleCurrentChange(n) {
      let topnData = this.topNchartData.allData
      this.topNchartData.data = util.pagingData(
        n - 1,
        this.topNchartData.size,
        topnData
      )
    }
  }
}
</script>

