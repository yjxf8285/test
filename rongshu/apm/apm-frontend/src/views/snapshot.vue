<style lang="scss">
@import "~vars";

.snapshot1024 {
  .common-container.no-border {
    border: 0px;
    border-radius: 0px;
    margin: 0px;
  }
  > .el-dialog__wrapper {
    > .el-dialog {
      background-color: #f7f7f7;
      > .el-dialog__header {
        width: 100%;
        position: absolute;
        .el-dialog__headerbtn {
          margin-top: -10px;
          .el-icon-close {
            color: #062846;
          }
        }
      }
      > .el-dialog__body {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0px;
        > .common-container {
          width: 100%;
          height: 100%;
          border: none;
          margin: 0px;
          background-color: transparent;
          > .content {
            height: 100%;
            .outer-tabs {
              height: 100%;
              > .el-tabs__header {
                margin-bottom: 0px;
                border: 1px solid #dcdcdc;
                border: 0px;
                .el-tabs__item {
                  color: #666666;
                  border-radius: 5px 5px 0 0;
                  background-color: #eeeeee;
                  border: 1px solid #dcdcdc;
                  > span:first-child {
                    > a {
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      overflow: hidden;
                      max-width: 200px;
                      display: inline-block;
                      vertical-align: middle;
                    }
                  }
                  &.is-active {
                    background-color: #fff;
                  }
                }
                .el-tabs__nav-prev {
                  background-color: #fff;
                  border: 1px solid #dcdcdc;
                  border-width: 1px 0px 0px 1px;
                }
                .el-tabs__nav-next {
                  background-color: #fff;
                  border: 1px solid #dcdcdc;
                  border-width: 1px 1px 1px 0px;
                }
              }
              > .el-tabs__content {
                border: 1px solid #dcdcdc;
                background-color: #fff;
                border-radius: 5px;
                min-height: 90%;
                margin-bottom: 24px;
                > .el-tab-pane {
                  .el-tabs__header {
                    border: none;
                    border-bottom: 1px solid #dcdcdc;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .icon-apdex {
    margin-bottom: 2px;
  }
}
</style>
<template>
<div class="snapshot1024">
  <el-dialog
  ref="dialog"
  :fullscreen="true"
  :visible.sync="showDialog"
  @close="closeTabs">
    <div class="common-container">
      <div class="content">
      <el-tabs class="outer-tabs" v-model="selectedTabName" type="card" @tab-remove="(name)=>closeTab(name)" style="margin-top:10px">
        <el-tab-pane
        :key="tab.name"
        v-for="tab in tabs"
        :label="renderTabTitle(tab)"
        :name="tab.name"
        :closable="tab.type!='single-trans-snapshot'">
          <span slot="label">
            <a>
              <i class="icon-apdex"
                v-if="tab.type!='single-trans-snapshot'"
                :class="renderTabClass(tab)">
              </i>
              {{renderTabTitle(tab)}}
            </a></span>
          <SingleTransSnapshot v-if="tab.type==='single-trans-snapshot'" :options="tab.options" />
          <SingleComponentSnapshot v-else :options="tab.options" />
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
</el-dialog>
</div>
</template>
<script>
import { apdexConverter } from '_cbl'
import SingleTransSnapshot from './application/src/single-trans-snapshot/index.vue'
import SingleComponentSnapshot from './application/src/single-component-snapshot/index.vue'
import {
  Icon,
  Popover,
  Pagination,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Input,
  Dialog
} from 'element-ui'
export default {
  name: 'snapshot',
  components: {
    'el-icon': Icon,
    'el-popover': Popover,
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-input': Input,
    'el-dialog': Dialog,
    SingleTransSnapshot,
    SingleComponentSnapshot
  },
  data() {
    return {
      title: '事务',
      tabs: [],
      selectedTabName: '',
      showDialog: false
    }
  },
  watch: {
    selectedTabName(v) {
      this.$root.eventBus.switchTab(v)
    },
    showDialog() {
      if (!this.showDialog) {
        this.closeTabs()
      }
    }
  },
  created() {
    let vm = this
    vm.$root.eventBus.$on('snapshot-tab-change', (tabs, selectedTabName) => {
      vm.tabs.splice(0, vm.tabs.length)
      tabs.forEach(item => {
        vm.tabs.push(item)
      })
      vm.selectedTabName = selectedTabName
      if (vm.tabs && vm.tabs.length > 0) {
        this.showDialog = true
      } else {
        this.showDialog = false
      }
    })
  },
  mounted() {},
  methods: {
    renderTabClass(tab) {
      if (tab.type === 'single-trans-snapshot') {
        return []
      } else {
        let apdex = tab.options.apdex
        let cls = apdexConverter(apdex).apdexIconClass
        return [cls]
      }
    },
    renderTabTitle(tab) {
      if (tab.type === 'single-trans-snapshot') {
        return `事务：${tab.options.queryStr}`
      } else {
        return `${tab.options.transTime ||
          tab.options.responseTime ||
          0}ms-${tab.options.tierName}`
      }
    },
    closeTabs() {
      this.$root.eventBus.closeAllTabs()
      this.selectedTabName = null
      this.tabs = []
    },
    closeTab(tabName) {
      console.log(tabName)
      this.$root.eventBus.closeTab(tabName)
    },
    convertApdex(v) {
      switch (v.query.apdex) {
        case 'SLOW':
          return {
            apdexIconClass: 'icon-apdex-slow',
            apdexStatus: 'slow',
            apdexTitle: '缓慢'
          }
        case 'VERY_SLOW':
          return {
            apdexIconClass: 'icon-apdex-very-slow',
            apdexStatus: 'very_slow',
            apdexTitle: '非常慢'
          }
        case 'ERROR':
          return {
            apdexIconClass: 'icon-apdex-error',
            apdexStatus: 'error',
            apdexTitle: '错误'
          }
        case 'NORMAL':
        default:
          return {
            apdexIconClass: 'icon-apdex-normal',
            apdexStatus: 'normal',
            apdexTitle: '正常'
          }
      }
    }
  }
}
</script>

