<template>
  <div class="sinle-component-snapshot">
    <el-tabs v-model="currentTab" class="header-margin0">
      <el-tab-pane label="概览" name="single-component-overview">
        <SingleComponentOverview @switch-tab="onSwitchTab" :options="options" :selected="currentTab==='single-component-overview'" />
      </el-tab-pane>
      <el-tab-pane label="组件详情" name="single-component-detail">
        <SingleComponentDetail :options="options" :selected="currentTab==='single-component-detail'" />
      </el-tab-pane>
      <el-tab-pane label="堆栈追踪" name="single-component-stacktrace">
        <SingleComponentStackTrace @switch-tab="onSwitchTab" :options="options" :selected="currentTab==='single-component-stacktrace'" />
      </el-tab-pane>
      <el-tab-pane label="错误详情" name="single-component-error-detail">
        <SingleComponentErrorDetail :error="error" :options="options" :selected="currentTab==='single-component-error-detail'" />
      </el-tab-pane>
      <el-tab-pane label="数据库" name="single-component-database">
        <SingleComponentDatabase :options="options" :selected="currentTab==='single-component-database'" />
      </el-tab-pane>
      <el-tab-pane label="远程调用" name="single-component-remote">
        <SingleComponentRemote :options="options" :selected="currentTab==='single-component-remote'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  Icon,
  Popover,
  Pagination,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Input
} from 'element-ui'

import SingleComponentOverview from './src/single-component-overview.vue'
import SingleComponentDetail from './src/single-component-detail.vue'
import SingleComponentStackTrace from './src/single-component-stacktrace.vue'
import SingleComponentErrorDetail from './src/single-component-error-detail.vue'
import SingleComponentDatabase from './src/single-component-database.vue'
import SingleComponentRemote from './src/single-component-remote.vue'
export default {
  components: {
    'el-icon': Icon,
    'el-popover': Popover,
    'el-pagination': Pagination,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-input': Input,
    SingleComponentOverview,
    SingleComponentDetail,
    SingleComponentStackTrace,
    SingleComponentErrorDetail,
    SingleComponentDatabase,
    SingleComponentRemote
  },
  data() {
    return {
      currentTab: 'single-component-overview',
      error: ''
    }
  },
  props: {
    options: {
      required: true,
      type: Object
    }
  },
  methods: {
    onSwitchTab(toTab, options) {
      console.log(options)
      this.currentTab = toTab
      switch (this.currentTab) {
        case 'single-component-error-detail':
          this.error = options.error
          break
        default:
          break
      }
    }
  }
}
</script>
