<style lang="scss" scoped>
  @import "~vars";
  .threaddump {
    .table-title {
      padding-bottom: 10px;
      margin-top: 30px;
      border-bottom: solid 1px;
      font-size: 16px;
      font-weight: normal;
    }
    .dump-bar {
      height: 52px;
      padding: 24px;
      box-sizing: border-box;
      text-align: left;
    }
    .sys-selector {
      margin-right: 20px;
    }
    .duration-container {
      // position: relative;
      // bottom: -14px;
      margin: 0 10px;
      display: inline-block;
      width: 200px;
    }
    .label {
      position: relative;
      top: -14px;
    }
    .auto-container {
      position: relative;
      display: inline-block;
      margin-left: 15px;
      top: -14px;
    }
    .pos-fix {
      position: relative;
      top: -14px;
    }
    .pagination {
      float: right;
      margin-top: 5px;
    }
    .refresh-button {
      margin-left: 15px;
    }
    .instance-list {
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>

<template>
  <div class="threaddump">
    <top-bar @barChange="barChange" title="线程分析"></top-bar>
    <div class="common-container">
      <div class="dump-bar">
        <span class="label">剖析时长：</span>
        <div class="duration-container">
          <el-slider v-model="intervalNum" :step="1" :min="1" :max="10" :format-tooltip="(v) => {return v + '分钟'}" show-stops>
          </el-slider>
        </div>
        <el-button type="primary" size="small" class="pos-fix" :disabled="!instanceId" @click="startAnalysis">开始剖析</el-button>
      </div>
      <div class="content" ref="reportListContainer" style="position: relative;">
        <el-table :data="reports" stripe>
          <el-table-column prop="submit_time" label="提交时间"></el-table-column>
          <el-table-column prop="agent_name" label="实例"></el-table-column>
          <el-table-column prop="intervalNum" :formatter="intervalFormatter" label="剖析时长(min)"></el-table-column>
          <el-table-column prop="status_name" label="状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" @click="handleCancel(scope.$index, scope.row)" v-if="scope.row.status <= 1">取消</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.status >= 2">删除</el-button>
              <el-button size="small" @click="handleView(scope.$index, scope.row)" v-if="scope.row.status == 2">查看报告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pag-wrap">
          <el-pagination
            v-show="paginator.total > 0"
            layout="total, prev, pager, next"
            @current-change="togglePage"
            :page-size="paginator.pageSize"
            :current-page="paginator.currentPage"
            :total="paginator.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Table,
    TableColumn,
    Button,
    Slider,
    Pagination,
    Switch,
    Notification,
    Loading
  } from 'element-ui'
  import topBarQuery from '../../../../../components/mixin/topBarQuery'
export default {
    name: 'threaddump',
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-slider': Slider,
      'el-pagination': Pagination,
      'el-switch': Switch
    },
    mixins: [topBarQuery],
    data() {
      return {
        sysLoading: false,
        isFirst: true,
        reports: [],
        intervalNum: 1,
        autoRefresh: true,
        paginator: {
          currentPage: 1,
          total: 0,
          pageCount: 10
        }
      }
    },
    computed: {
      instanceId() {
        return this.$route.query.instanceToken || ''
      }
    },
    methods: {
      barChange(queryData) {
        this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
        this.queryData = {
          appId: this.appId,
          startTime: this.startTime,
          endTime: this.endTime,
          aggrInterval: this.aggrInterval
        }
        this.getThreaddumpList()
      },
      startAnalysis() {
        let vm = this
        if (vm.instanceId) {
          vm.api.startAnalysis({
            data: {
              condition: {
                appId: vm.appId,
                interval: vm.intervalNum
              }
            },
            success(res) {
              if (!res.success) {
                Notification({
                  title: '操作失败',
                  message: res.message,
                  type: 'error'
                })
              } else {
                Notification({
                  title: '操作成功',
                  type: 'success'
                })
                vm.getThreaddumpList()
              }
            }
          })
        }
      },
      getThreaddumpList() {
        let vm = this
        let loadingIns = null
        if (String(vm.appId)) {
          vm.api.getThreaddumpList({
            data: {
              condition: this.queryData,
              page: {
                index: vm.paginator.currentPage - 1,
                size: vm.paginator.pageCount
              }
            },
            beforeSend() {
              loadingIns = Loading.service({
                target: vm.$refs.reportListContainer
              })
            },
            complete() {
              loadingIns.close()
            }
          }).done(res => {
            if (res.success) {
              vm.reports = res.data.page_data
              vm.paginator.total = res.data.total_count
            }
          })
        }
      },
      intervalFormatter(row, column, cellValue) {
        return row.interval / 60000
      },
      handleView(index, row) {
        this.$router.push({
          name: 'tier-threaddump-report',
          query: Object.assign({}, this.$route.query, {
            condition: Object.assign({}, this.queryData, {
              id: row.id,
              agent_name: row.agent_name || '',
              start_time: row.start_time || '',
              interval: row.intervalNum || ''
            })
          })
        })
      },
      handleCancel(index, row) {
        let vm = this
        vm.api.cancelAnalysis({
          data: {
            condition: {
              id: row.id
            }
          },
          success(res) {
            if (res.code === 0) {
              Notification({
                title: '操作成功',
                type: 'success'
              })
              vm.getThreaddumpList()
            } else {
              Notification({
                title: '操作失败，请稍后重试',
                message: res.message,
                type: 'error'
              })
            }
          }
        })
      },
      handleDelete(index, row) {
        let vm = this
        vm.api.deleteAnalysis({
          data: {
            condition: {
              id: row.id
            }
          },
          success(res) {
            if (res.code === 0) {
              Notification({
                title: '操作成功',
                type: 'success'
              })
              vm.getThreaddumpList()
            } else {
              Notification({
                title: '操作失败，请稍后重试',
                message: res.message,
                type: 'error'
              })
            }
          }
        })
      },
      togglePage(currentPage) {
        this.paginator.currentPage = currentPage
        this.getThreaddumpList()
      }
    }
  }
</script>
