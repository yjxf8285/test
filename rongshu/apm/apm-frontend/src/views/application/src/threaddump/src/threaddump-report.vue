<style lang="scss">
@import "~vars";
.threaddump-report {
  .query-bar {
    margin: $marginWidth;
    background-color: #fff;
    height: 32px;
    padding: 0px;
    box-shadow: 0 0px 1px rgba(60, 65, 71, 0.5);
    .getback-btn {
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-left: solid 1px #dcdcdc;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      cursor: pointer;
      &:hover {
        background: #2879ff;
        color: #fff;
      }
    }
  }
  .table-title {
    padding-bottom: 10px;
    margin: 30px 0 15px 0;
    border-bottom: solid 1px;
    font-size: 16px;
    font-weight: normal;
  }
  .info-area {
    padding: 10px;
    border: 1px solid;
    border-radius: 2px;
    margin: $marginWidth;
    .info {
      display: inline-block;
      margin-right: 16px;
    }
    .label {
      font-weight: bold;
    }
    .label:after {
      content: "：";
    }
  }
  .thread-row {
    cursor: pointer;
  }
}
</style>

<template>
  <div class="threaddump-report" ref="report">
    <div class="query-bar">
      <div class="getback-btn fn-fr" @click="backToThreaddump">
        <span>返回</span>
      </div>
    </div>
    <div>
      <div class="info-area theme-border-color-base theme-background-color-normal-1">
        <div class="info">
          <span class="label">开始时间</span>
          <el-tag type="gray">{{ $route.query.condition.start_time || '--' }}</el-tag>
        </div>
        <div class="info">
          <span class="label">持续时间（min）</span>
          <el-tag type="gray">{{ $route.query.condition.interval ? $route.query.condition.interval / 60000 : '--' }}</el-tag>
        </div>
        <div class="info">
          <span class="label">实例</span>
          <el-tag type="gray">{{ $route.query.condition.agent_name || '--' }}</el-tag>
        </div>
      </div>
      <div class="common-container">
        <div class="header-title">
          <i class="title-icon icon ion-podium"></i>
          <span class="title-name">线程耗时</span>
            <div class="right-info">
              <span>线程数：{{ threadList.length }}</span>
              <span>总CPU时间：{{ (totalCpuTime / 1000000).toFixed(0) }} （ms）</span>
            </div>
        </div>
        <div class="content">
          <el-table ref="threadTable" :data="threadList" stripe highlight-current-row @row-click="selectThread">
            <el-table-column class-name="thread-row" prop="id" label="线程Id" width="100"></el-table-column>
            <el-table-column class-name="thread-row" prop="name" label="线程名"></el-table-column>
            <el-table-column class-name="thread-row" prop="cpu_time" :formatter="(row, col, cell) => Number((row.cpu_time / 1000000).toFixed(3))" label="CPU时间(ms)"></el-table-column>
            <el-table-column class-name="thread-row" prop="cpu_time_rate" label="CPU时间(%)"></el-table-column>
            <el-table-column class-name="thread-row" prop="state" label="状态"></el-table-column>
          </el-table>
          <el-dialog title="调用栈详情" :visible.sync="stackTraceVisible" size="large">
            <h4 class="table-title theme-border-color-darken">{{ currentThread.name }}</h4>
            <el-tree :data="stackTrace" :default-expand-all="true"></el-tree>
          </el-dialog>
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
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Slider,
  Tag,
  Tree,
  Loading,
  Dialog
} from 'element-ui'
import topBarQuery from '../../../../../components/mixin/topBarQuery'

function addChildren(target, child) {
  if (target[0]) {
    if (target[0].children) {
      addChildren(target[0].children, child)
    } else {
      target[0].children = [
        {
          label:
            child.className + '.' + child.methodName + ` (${child.lineNumber})`
        }
      ]
    }
  } else {
    target[0] = {
      label: child.className + '.' + child.methodName + ` (${child.lineNumber})`
    }
  }
}

export default {
  name: 'threaddump-report',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-input': Input,
    'el-slider': Slider,
    'el-tag': Tag,
    'el-tree': Tree,
    'el-dialog': Dialog
  },
  mixins: [topBarQuery],
  mounted() {
    this.getThreaddumpAnalysisReport()
  },
  data() {
    return {
      threadList: [],
      currentThread: {},
      stackTrace: [],
      stackTraceVisible: false,
      totalCpuTime: 0,
      loadingInstance: {}
    }
  },
  watch: {
    currentThread: {
      deep: true,
      handler(v) {
        if (v && v.stack_trace && v.stack_trace.length) {
          let res = []
          v.stack_trace.forEach(e => {
            addChildren(res, e)
          })
          this.stackTrace = res
        }
      }
    }
  },
  methods: {
    getThreaddumpAnalysisReport() {
      let vm = this
      vm.api.getThreaddumpAnalysisReport({
        data: {
          condition: {
            id: this.$route.query.condition.id
          }
        },
        beforeSend() {
          vm.loadingInstance = Loading.service({
            target: vm.$refs.report
          })
        },
        complete() {
          vm.loadingInstance.close()
        },
        success(res) {
          if (res && res.data && res.data.length) {
            vm.threadList = res.data.sort((a, b) => b.cpu_time - a.cpu_time)
            if (vm.threadList && vm.threadList.length) {
              vm.totalCpuTime = vm.threadList.reduce((total, thread) => {
                return total + thread.cpu_time
              }, 0)
              vm.threadList = vm.threadList.map(th => {
                th.cpu_time_rate =
                  Number((th.cpu_time / vm.totalCpuTime * 100).toFixed(3)) +
                  '%'
                return th
              })
              // vm.currentThread = vm.threadList[0]
              // vm.$refs.threadTable.setCurrentRow(vm.currentThread)
            }
          }
        }
      })
    },
    backToThreaddump() {
      this.$router.push({
        name: this.$route.query.tierId ? 'tier-threaddump' : 'threaddump',
        query: Object.assign({}, this.$route.query, {
          sys: this.$route.query.sys,
          ins: this.$route.query.ins
        })
      })
    },
    selectThread(currentRow) {
      this.currentThread = currentRow
      this.stackTraceVisible = true
    }
  }
}
</script>


