<template>
  <div class="transaction">
    <top-bar title="事务" @barChange="barChange"></top-bar>
    <FilterBarSimple ref="simplefilterbar" :contribution="true" @fbarChange="fbarChange"></FilterBarSimple>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">事务</span>
        <div class="seach-area fn-fr" style="padding:12px;">
          <el-input class="circular" v-model.trim="transName" placeholder="请输入内容"
                    size="mini"></el-input>
        </div>
      </div>
      <div class="content">
        <div class="table-wrap">
          <el-table :data="dataList" class="table-list" @sort-change="SummariesSortChange" v-loading="dataListloading">
            <el-table-column label="事务名称">
              <template slot-scope="scope">
                <i title="正常" class="icon-health " :class="scope.row.transClass"></i>
                <router-link
                  :to="'single-transaction?transName='+scope.row.transName+'&tierId='+tierId+'&instanceToken='+instanceToken"
                  class="transaction-name">
                  <span>{{scope.row.transName}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="事务分布">
              <template slot-scope="scope">
                <Popover ref="popover1" placement="bottom" trigger="hover">
                  <table class="distribute-popover">
                    <tr v-for="(item, index) in scope.row.distributeTipData" :key="index">
                      <td width="50" class="t-r">{{item.name}}</td>
                      <td width="80">
                        <div class="bar-g"
                             :style="{height:'8px',width:item.percent,background:item.color}"></div>
                      </td>
                      <td width="30" class="t-c">{{item.percent}}</td>
                      <td class="t-r">{{item.value}}</td>
                    </tr>
                  </table>
                </Popover>
                <PercentBar :barData="scope.row.distributeBarData" v-popover:popover1></PercentBar>
              </template>
            </el-table-column>
            <el-table-column prop="avgResponseTime" label="平均响应时间(ms)" sortable="custom"></el-table-column>
            <el-table-column prop="rpm" label="吞吐率(rpm)" sortable="custom">
            </el-table-column>
            <el-table-column prop="requestNum" label="请求数" sortable="custom">
            </el-table-column>
            <el-table-column prop="errorNum" label="错误数" sortable="custom">
            </el-table-column>
            <el-table-column prop="contribution" label="贡献度(%)" sortable="custom">
            </el-table-column>
            <el-table-column prop="epm" label="错误/分钟(epm)" sortable="custom">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '_util'
  import {Popover, Pagination, Input, Table, TableColumn} from 'element-ui'
  import FilterBarSimple from '../../../../../components/filter-bar/filter-bar-simple.vue'
  import PercentBar from '../../../../../components/ui-mod/percent-bar.vue'
  import topBarQuery from '../../../../../components/mixin/topBarQuery'

  export default {
    data() {
      return {
        dataListloading: true,
        summariesSortField: 'AVG_RESPONSE_TIME',
        summariesSortOrder: 'desc',
        transName: '',
        dataList: [],
        allDataList: []
      }
    },
    components: {
      'el-pagination': Pagination,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-input': Input,
      FilterBarSimple,
      Popover,
      PercentBar
    },
    mixins: [topBarQuery],
    mounted() {
    },
    watch: {
      transName() {
        this.getSummariesData()
        this.$refs.simplefilterbar.reset()
      }
    },
    computed: {
      tierId() {
        return this.$route.query.tierId || ''
      },
      instanceToken() {
        return this.$route.query.instanceToken || ''
      }
    },
    methods: {
      barChange(queryData) {
        this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
        this.getSummariesData()
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
          res = this.allDataList
        } else {
          dataList.forEach(m => {
            let maxContribution = (condition.hideContribution === true) ? 1 : -1
            if (
              m.transName.search(condition.keyword) >= 0 &&
              m.contribution > maxContribution &&
              m.avgResponseTime > condition.avgResponseTime &&
              m.rpm > condition.rpm &&
              m.errorNum > condition.errorNum
            ) {
              res.push(m)
            }
          })
        }
        return res
      },
      SummariesSortChange(sortObj) {
        switch (sortObj.prop) {
          case 'avgResponseTime':
            this.summariesSortField = 'AVG_RESPONSE_TIME'
            break
          case 'rpm':
            this.summariesSortField = 'RPM'
            break
          case 'requestNum':
            this.summariesSortField = 'REQUEST_NUM'
            break
          case 'errorNum':
            this.summariesSortField = 'ERROR_NUM'
            break
          case 'epm':
            this.summariesSortField = 'EPM'
            break
          default:
            this.summariesSortField = 'AVG_RESPONSE_TIME'
            break
        }
        console.info(this.summariesSortField)
        switch (sortObj.order) {
          case 'ascending':
            this.summariesSortOrder = 'asc'
            break
          case 'descending':
            this.summariesSortOrder = 'desc'
            break
        }
        this.getSummariesData()
      },
      getSummariesData() {
        this.dataListloading = true
        this.api
          .getSummaries({
            data: {
              condition: {
                appId: this.appId,
                startTime: this.startTime,
                endTime: this.endTime,
                transName: this.transName
              },
              topN: 100,
              sort: {
                field: this.summariesSortField,
                order: this.summariesSortOrder

              }
            }
          })
          .then(res => {
            if (res.code === 0) {
              res.data.map(m => {
                let tdb = m.transactionDistributionOutBO
                if (tdb) {
                  let requestNum = m.requestNum
                  m.distributeBarData = [
                    tdb.normalRequestNum,
                    tdb.slowRequestNum,
                    tdb.verySlowRequestNum,
                    tdb.errorRequestNum
                  ]
                  m.distributeTipData = [
                    {
                      name: '正常',
                      color: '#a8d96f',
                      percent:
                      util.toDecimal(tdb.normalRequestNum / requestNum * 100) +
                      '%',
                      value: tdb.normalRequestNum
                    },
                    {
                      name: '缓慢',
                      color: '#85cae6',
                      percent:
                      util.toDecimal(tdb.slowRequestNum / requestNum * 100) + '%',
                      value: tdb.slowRequestNum
                    },
                    {
                      name: '非常慢',
                      color: '#fab421',
                      percent:
                      util.toDecimal(tdb.verySlowRequestNum / requestNum * 100) +
                      '%',
                      value: tdb.verySlowRequestNum
                    },
                    {
                      name: '错误',
                      color: '#f38211',
                      percent:
                      util.toDecimal(tdb.errorRequestNum / requestNum * 100) +
                      '%',
                      value: tdb.errorRequestNum
                    }
                  ]
                  let healthyType = m.health || 'HEALTHY'
                  m.transClass = util.handleHealthy(healthyType).IconClass
                } else {
                  m.distributeBarData = [0, 0, 0, 0]
                }
              })

              this.dataList = res.data
              this.allDataList = _.cloneDeep(res.data)
            }
          })
          .always(res => {
            this.dataListloading = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #a8d96f;
  $orange: #85cae6;
  $lightred: #fab421;
  $red: #f38211;
  .transaction {
    .table-wrap {
      padding: 10px;
    }
    .table-list {
      width: 100%;
      .icon {
        font-size: 20px;
        color: #00acc1;
        vertical-align: middle;
      }
      .transaction-name {
        vertical-align: middle;
      }
    }
    .pagination-wrap {
      padding: 0 5px 0 0;
      text-align: right;
    }
  }
</style>
