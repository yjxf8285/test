<template>
  <div class="transaction">
    <FilterBarSimple ref="simplefilterbar" :contribution="true" @fbarChange="fbarChange"></FilterBarSimple>
    <au-panel title="事务" icon="bars" class="common-panel">
      <div slot="title-right">
        <au-input class="circular" v-model.trim="transName" placeholder="请输入内容"
        ></au-input>
      </div>
     <div>
       <router-link :to="{name: 'transaction-detail'}">Go to Detail</router-link>
     </div>
    </au-panel>
  </div>
</template>

<script>
import util from '_utils'
import {FilterBarSimple} from '_components/filter-bar'

export default {
  data () {
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
    FilterBarSimple
  },
  mounted () {
  },
  watch: {
    transName () {
      // this.getSummariesData()
      this.$refs.simplefilterbar.reset()
    }
  },
  computed: {
    tierId () {
      return this.$route.query.tierId || ''
    },
    instanceToken () {
      return this.$route.query.instanceToken || ''
    }
  },
  methods: {
    fbarChange (condition) {
      console.info('fc', condition)
      // this.dataList = this.handleFilterData(condition, this.allDataList)
    },
    handleFilterData (condition, dataList) {
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
    SummariesSortChange (sortObj) {
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
    getSummariesData () {
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
            // this.allDataList = _.cloneDeep(res.data)
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
