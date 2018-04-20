<template>
  <div class="sinle-trans-snapshot">
    <el-tabs v-model="currentTab" class="header-margin0">
      <el-tab-pane label="概览" name="single-trans-overview">
        <SingleTransOverview :options="options" :selected="currentTab==='single-trans-overview'" />
      </el-tab-pane>
      <el-tab-pane label="调用瀑布流" name="single-trans-waterfall">
        <SingleTransWaterfall :options="options" :selected="currentTab==='single-trans-waterfall'" />
      </el-tab-pane>
      <el-tab-pane label="数据库&远程调用" name="single-trans-database">
        <SingleTransDatabase :options="options" :selected="currentTab==='single-trans-database'" />
      </el-tab-pane>
      <el-tab-pane label="错误详情" name="single-trans-error-detail">
        <SingleTransErrorDetail :options="options" :selected="currentTab==='single-trans-error-detail'" />
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
import SingleTransOverview from './src/single-trans-overview.vue'
import SingleTransWaterfall from './src/single-trans-waterfall.vue'
import SingleTransDatabase from './src/single-trans-database.vue'
import SingleTransErrorDetail from './src/single-trans-error-detail.vue'
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
    SingleTransOverview,
    SingleTransWaterfall,
    SingleTransDatabase,
    SingleTransErrorDetail
  },
  data() {
    return {
      currentTab: 'single-trans-overview'
    }
  },
  props: {
    options: {
      required: true,
      type: Object,
      default: {}
    }
  },
  methods: {}
}
</script>
