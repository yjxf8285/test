<style lang="scss" scoped>

</style>
<template>
  <div class="tier-list">
    <top-bar title="层/节点" @barChange="barChange"></top-bar>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">层/节点</span>
      </div>
      <div class="content">
        <div class="tier-list">
          <div class="page-container" ref="tableContainer">
            <el-table
              @row-click="rowClick"
              :data="dataList"
              style="width: 100%">
              <el-table-column width="50">
                <template slot-scope="scope">
                <span v-if="scope.row.parentId=='root'"><i class="el-icon-arrow-down" v-if="scope.row.isOpen"></i>
                <i class="el-icon-arrow-right" v-if="!scope.row.isOpen"></i></span>
                </template>
              </el-table-column>
              <el-table-column label="Tier">
                <template slot-scope="scope">
                  <router-link class="theme-font-color-primary" :to="linkTo(scope)">
                    <span @click="storeInstances(scope)">{{scope.row.name}}</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="健康状况" prop="health">
                <template slot-scope="scope">
                  <i class="icon-health " :class="scope.row.healthClass"></i>
                </template>
              </el-table-column>
              <el-table-column
                label="平均响应时间(ms)"
                prop="avgResponseTime">
                <template slot-scope="scope">
                  <span v-if="scope.row.type!=2">{{scope.row.avgResponseTime}}</span>
                  <span v-if="scope.row.type==2">N/A</span>
                </template>
              </el-table-column>
              <el-table-column
                label="吞吐率(rpm)"
                prop="rpm">
                <template slot-scope="scope">
                  <span v-if="scope.row.type!=2">{{scope.row.rpm}}</span>
                  <span v-if="scope.row.type==2">N/A</span>
                </template>
              </el-table-column>
              <el-table-column
                label="错误率"
                prop="errorRate">
                <template slot-scope="scope">
                  <span v-if="scope.row.type!=2">{{scope.row.errorRate}}</span>
                  <span v-if="scope.row.type==2">N/A</span>%


                </template>
              </el-table-column>
              <el-table-column label="错误/分钟(epm)" prop="epm"></el-table-column>

            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import { Row, Col, Table, TableColumn, Loading, Button } from 'element-ui'
import topBarQuery from '../../../../../components/mixin/topBarQuery'

export default {
  name: 'tier-list',
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button
  },
  mixins: [topBarQuery],
  data() {
    return {
      originData: [],
      tableLoading: {},
      topBarData: [],
      dataList: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getData()
    },
    linkTo(scope) {
      let tierId = ''
      let instanceToken = ''
      let instanceType = ''
      if (scope.row.parentId === 'root') {
        tierId = scope.row.id
      } else {
        tierId = scope.row.parentId
        instanceToken = scope.row.id
        instanceType = scope.row.type
      }
      return {
        name: 'tier-detail',
        query: {
          tierId,
          instanceToken,
          instanceType
        }
      }
    },
    storeInstances(scope) {
      if (scope.row.parentId === 'root') {
        this.$root.eventBus.instancesInTiers = scope.row.child.map(ins =>
          Object.assign({}, ins, {
            token: ins.id,
            agent_config_type: ins.type,
            agent_config_name: ins.name
          })
        )
      } else {
        for (let tier of this.dataList) {
          if (tier.id === scope.row.parentId) {
            this.$root.eventBus.instancesInTiers = tier.child.map(ins =>
              Object.assign({}, ins, {
                token: ins.id,
                agent_config_type: ins.type,
                agent_config_name: ins.name
              })
            )
          }
        }
      }
    },
    getData() {
      let that = this

      this.api
        .getTierList({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime,
              appId: this.appId
            }
          },
          beforeSend() {
            that.tableLoading = Loading.service({
              target: that.$refs.tableContainer
            })
          },
          complete() {
            that.tableLoading.close()
          }
        })
        .done(res => {
          if (res.code !== 0) return
          res.data = res.data || []
          res.data.map(m => {
            if (m.health) {
              m.healthClass = util.handleHealthy(m.health).IconClass
            } else {
              m.healthClass = 'icon-health-healthy'
            }

            m.child.map(mm => {
              if (mm.health) {
                mm.healthClass = util.handleHealthy(mm.health).IconClass
              } else {
                mm.healthClass = 'icon-health-healthy'
              }
            })
          })
          that.originData = _.cloneDeep(that.format(res.data))
          that.dataList = that.format(res.data)
        })
    },
    format(oData) {
      let newData
      oData.map(m => {
        m.isOpen = false
        m.parentId = 'root'
        m.avg = util.toDecimal(m.avg, 3)
        !_.isEmpty(m.child) &&
          m.child.map(mm => {
            mm.avg = util.toDecimal(mm.avg, 3)
            mm.parentId = m.id
            mm.parentName = m.name
          })
      })
      newData = oData.filter(m => {
        return m.name !== '__browser__'
      })
      return newData
    },
    addRow(rowId) {
      let originData = this.originData
      let childrenList = originData.find(m => m.id === rowId).child
      let addIndex = _.findIndex(this.dataList, m => m.id === rowId)
      this.dataList.splice(addIndex + 1, 0, ...childrenList)
    },
    delRow(rowId) {
      this.dataList = _.remove(this.dataList, m => m.parentId !== rowId)
    },
    toggleOpen(rowId) {
      this.dataList.map(m => {
        if (m.id === rowId) {
          m.isOpen = !m.isOpen
        }
      })
    },
    rowClick(rowData) {
      if (rowData.parentId !== 'root') return
      rowData.isOpen ? this.delRow(rowData.id) : this.addRow(rowData.id)
      this.toggleOpen(rowData.id)
    }
  }
}
</script>
