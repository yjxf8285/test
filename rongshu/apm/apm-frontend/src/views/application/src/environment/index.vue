<style lang="scss" scoped>

</style>
<template>
  <div>
    <top-bar @barChange="barChange" title="执行环境"></top-bar>
    <div class="common-container">
      <div class="content table-box" ref="tableContainer" style="margin-top:-15px;">
        <el-table :data="environmentDataList" fit style="width: 100%" class="mt20">
          <el-table-column prop="key" header-align="center" align="center" label="名称"></el-table-column>
          <el-table-column prop="value" header-align="center" label="值"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import { Table, TableColumn, Loading } from 'element-ui'
import topBarQuery from '../../../../components/mixin/topBarQuery'

export default {
  name: 'app-environment',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  mixins: [topBarQuery],
  data() {
    return {
      environmentData: [],
      queryData: {},
      loadingInstance: null
    }
  },
  mounted() {},
  computed: {
    environmentDataList() {
      let list = []
      if (this.environmentData) {
        Object.keys(this.environmentData).forEach(key => {
          let value = this.environmentData[key]

          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              list.push({
                key: key + '-' + (index + 1),
                value: Object.keys(item)
                  .map(iItem => {
                    return iItem + ':' + item[iItem]
                  })
                  .join(', ')
              })
            })
          } else {
            if (key === 'startTimestamp') {
              value = util.formatDate(value)
            }
            list.push({
              key: key,
              value: value
            })
          }
        })
      }
      return list
    }
  },
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.queryData = {
        condition: {
          aggrInterval: this.aggrInterval,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }
      this.getData()
    },
    getData() {
      let vm = this
      let loadingInstance = null
      vm.api.getAppEnvironment({
        data: this.queryData,
        beforeSend() {
          loadingInstance = Loading.service({
            target: vm.$refs.tableContainer
          })
        },
        success(res) {
          if (res.code === 0) {
            vm.environmentData = res.data
          }
        },
        complete() {
          loadingInstance.close()
          loadingInstance = null
        }
      })
    }
  }
}
</script>
