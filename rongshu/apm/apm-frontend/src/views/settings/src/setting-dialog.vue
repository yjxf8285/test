<style lang="scss" scoped>
.setting-layout {
  position: static;
  display: flex;
  width: 100%;
  .instance-list {
    width: 300px;
    padding-right: 10px;
    overflow: hidden;
    .el-table {
      border: 1px solid #dcdcdc;
      border-width: 0px 1px 0px 1px;
      border-radius: 0px;
    }
    .instance-list-footer {
      height: 34px;
      line-height: 34px;
      border: 1px solid #dcdcdc;
      border-top: 0px;
      .check-all {
        margin-left: 10px;
      }
      span {
        float: right;
        height: 36px;
        line-height: 36px;
        margin-right: 10px;
      }
    }
  }
  .config-table {
    flex: 1;
    width: 100%;
  }
  .mutiple-style {
    height: 500px;
  }
}
</style>

<template>
  <el-dialog :width="mutiple? '70%' : '50%'" title="实例配置" :visible.sync="settingDialogVisible">
    <div class="setting-layout">
      <div
      class="instance-list"
      :class="{
        'mutiple-style': mutiple
      }"
      v-show="mutiple">
        <div class="toolbar">
          <el-input class="apm-input-border-radius__4-4-0-0" placeholder="请输入要检索的实例名称" prefix-icon="el-icon-search" v-model="dialogSearchName"></el-input>
        </div>
        <el-table class="apm-table-bordered" ref="instanceTable" :show-header="false" :data="dialogInstanceList" style="width: 100%" height="426">
          <el-table-column width="50" label="全选">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected" @change="toggleInstanceSelected(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="请选择要更新的实例" prop="name">
          </el-table-column>
        </el-table>
        <div class="instance-list-footer">
          <el-checkbox label="全选" class="check-all" v-model="isAllChecked" @change="toggleAllDialogInstanceSelected"></el-checkbox>
          <span style="float:right;">
            当前选中{{originInstanceList.filter(instance=>instance.selected).length}}个
          </span>
        </div>
      </div>
      <div
      class="config-table"
      :class="{
        'mutiple-style': mutiple
      }"
      ref="loadingContainer">
        <el-table class="apm-table-bordered" :data="configTableList" style="width: 100%" height="500">
          <el-table-column property="configName" label="配置名称" width="150"></el-table-column>
          <!-- <el-table-column property="appConfig" label="应用配置" width="150">
            <template slot-scope="scope">
              {{ typeof scope.row.appConfig == 'boolean' ? (scope.row.appConfig ? 'ON' : 'OFF') : scope.row.appConfig}}
            </template>
          </el-table-column> -->
          <el-table-column label="实例配置" property="key">
            <template slot-scope="scope">
              <div style="padding-top: 5px;">
                <el-input v-if="!currentInsConfig[scope.row.key].isBoolean" size="mini" class="config-input" v-model="currentInsConfig[scope.row.key].value" @change="validateConfigItem(scope.row.key)"></el-input>
                <el-switch class="config-switch" v-if="currentInsConfig[scope.row.key].isBoolean" v-model="currentInsConfig[scope.row.key].value" @change="validateConfigItem(scope.row.key)"></el-switch>
                <transition name="slide">
                  <div class="warning theme-font-color-danger" v-show="!currentInsConfig[scope.row.key].correct">
                    {{ currentInsConfig[scope.row.key].warning }}
                  </div>
                </transition>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="$emit('update:show', false)">取消</el-button>
      <el-button size="mini" type="primary" :loading="confirmConfigLoading" @click="confirmConfig">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '_util'
import loadingMixin from '_components/mixin/loading.js'
import {
  Button,
  Table,
  Tag,
  TableColumn,
  Input,
  Form,
  FormItem,
  Dialog,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Switch,
  Tooltip,
  Notification,
  Checkbox
} from 'element-ui'
export default {
  name: 'setting-dialog',
  mixins: [loadingMixin],
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-switch': Switch,
    'el-tooltip': Tooltip,
    'el-tag': Tag,
    'el-checkbox': Checkbox
  },
  data() {
    return {
      settingDialogVisible: false,
      appConfig: {},
      configIndexMap: [],
      isAllChecked: false,
      originInstanceList: [],
      dialogSearchName: '',
      currentInsConfig: {},
      confirmConfigLoading: false,
      configTableList: [],
      // validators 会从后端服务拉取出来，当前的设置仅是一个格式
      validators: {
        'kepler.agent.collector.host': {
          required: true,
          missingMessage: '请输入主机地址'
        },
        'kepler.agent.collector.port': {
          required: true,
          missingMessage: '请输入端口号',
          invalidMessage: '请输入正确的端口号，只能为1~65535之间的整数',
          validType: {
            min: 0,
            max: 65535
          }
        },
        'kepler.sampling.rate': {
          required: true,
          missingMessage: '请输入采样率',
          invalidMessage: '请输入正确的采样率，最小为0, 最大为1000',
          validType: {
            min: 0,
            max: 1000
          }
        },
        'kepler.healthcheck.period': {
          required: true,
          missingMessage: '请输入心跳周期',
          invalidMessage: '请输入正确的心跳周期，仅允许正整数',
          validType: 'positiveInteger'
        },
        'kepler.apdext.time': {
          required: true,
          missingMessage: '请输入Apdext',
          invalidMessage: '请输入正确的Apdext，仅允许正整数',
          validType: 'positiveInteger'
        },
        'kepler.metrics.collect.period': {
          required: true,
          missingMessage: '请输入JVM采样周期',
          invalidMessage: '请输入正确的JVM采样周期，仅允许正整数',
          validType: 'positiveInteger'
        },
        'kepler.thread.dump.period': {
          required: true,
          missingMessage: '请输入线程采样周期',
          invalidMessage: '请输入正确的线程采样周期，仅允许正整数',
          validType: 'positiveInteger'
        },
        'kepler.browser.showlog': {},
        'kepler.browser.openTraceEnabled': {},
        'kepler.browser.transFrequency': {
          required: true,
          missingMessage: '请输入线程采样周期',
          invalidMessage: '请输入正确的线程采样周期，仅允许正整数',
          validType: 'positiveInteger'
        },
        'kepler.trace.destination.ignore': {},
        'kepler.data.send.batch.size': {},
        'kepler.http.excludeurl': {}
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mutiple: {
      type: Boolean,
      default: false
    },
    tierId: '',
    instanceId: '',
    instanceType: '',
    instances: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    show(v) {
      if (v) {
        this.$nextTick(() => {
          this.getInstanceConfig(this.instanceId, this.instanceType)
        })
      } else {
        if (this.mutiple) {
          this.originInstanceList.forEach(
            instance => (instance.selected = false)
          )
          this.dialogSearchName = ''
          this.isAllChecked = false
        }
      }
      this.settingDialogVisible = v
    },
    settingDialogVisible() {
      this.$emit('update:show', this.settingDialogVisible)
    },
    instances() {
      let originInstanceList = _.cloneDeep(this.instances)
      originInstanceList.forEach(item => (item.selected = false))
      this.originInstanceList = originInstanceList
    }
  },
  mounted() {
    this.getAppConfig()
    this.getValidators()
  },
  computed: {
    instanceList() {
      return _.cloneDeep(this.instances)
    },
    dialogInstanceList() {
      let filters = this.originInstanceList.filter(tier => {
        if (this.dialogSearchName) {
          return tier.name.indexOf(this.dialogSearchName) !== -1
        } else return true
      })
      this.$nextTick(() => {
        this.toggleInstanceSelected()
      })
      return filters
    }
  },
  methods: {
    getAppConfig() {
      let vm = this
      vm.api.getAppConfByIdAndType({
        data: {
          applicationId: vm.$root.eventBus.getCurSystem().id,
          type: vm.instanceType
        },
        success(res) {
          if (res.code === 0) {
            let configIndexMap = []
            res.data.forEach(item => {
              let key = item.key
              if (item.value === 'true' || item.value === 'false') {
                item.isBoolean = true
                item.value = item.value === 'true'
              }
              vm.appConfig[key] = Object.assign({}, item, {correct: true, warning: ''})
              configIndexMap.push(key)
            })
            vm.configIndexMap = configIndexMap
          }
        }
      })
    },
    /**
     * 在没有instanceId的情况下，会获取对应APPConfig下的instanceType的配置项,并且清空每一项的值
     * @argument instanceId 要获取配置的实例ID
     * @argument instanceType 要获取的的实例所属类别
     */
    getInstanceConfig(instanceId, instanceType) {
      let vm = this
      vm.loading = true
      if (instanceId) {
        vm.api.getInsConfig({
          data: {
            id: instanceId,
            type: instanceType
          },
          success(res) {
            if (res.code === 0) {
              // 格式化数据
              let temp = {}
              res.data.forEach(item => {
                let key = item.key
                temp[key] = _.cloneDeep(Object.assign({}, vm.appConfig[key], item))
                if (vm.appConfig[key] && temp[key].isBoolean) {
                  temp[key].value = item.value === 'true'
                }
              })
              vm.currentInsConfig = temp
              vm.initConfigTableList()
            }
          },
          complete() {
            vm.loading = false
          }
        })
      } else {
        let temp = {}
        Object.keys(vm.appConfig).forEach(key => {
          temp[key] = _.cloneDeep(vm.appConfig[key])
          temp[key].value = ''
        })
        vm.currentInsConfig = temp
        vm.initConfigTableList()
        vm.loading = false
      }
    },
    initConfigTableList() {
      let res = []
      for (let index in this.configIndexMap) {
        if (this.currentInsConfig[this.configIndexMap[index]]) {
          res.push({
            configName: this.appConfig[this.configIndexMap[index]].name,
            appConfig: this.appConfig[this.configIndexMap[index]].value,
            key: this.configIndexMap[index]
          })
        }
      }
      this.configTableList = res
    },
    confirmConfig() {
      let vm = this
      if (vm.validateAllConfig()) {
        if (vm.mutiple) {
          let instanceIds = []
          vm.originInstanceList.forEach(instance => {
            if (instance.selected) {
              instanceIds.push(instance.id)
            }
          })
          if (instanceIds.length === 0) {
            Notification({
              title: '提示信息',
              type: 'warning',
              message: '请选择您要更新的实例'
            })
            return
          }
          vm.api.updateMutiInsConf({
            data: {
              type: vm.instanceType,
              instanceIds: instanceIds,
              configurations: Object.values(vm.currentInsConfig).filter(config => config.value !== '')
            },
            beforeSend() {
              vm.confirmConfigLoading = true
            },
            complete() {
              vm.confirmConfigLoading = false
              vm.settingDialogVisible = false
            },
            success(res) {
              if (res.code === 0) {
                Notification({
                  title: '批量配置成功',
                  type: 'success'
                })
              } else {
                Notification({
                  title: '修改配置失败',
                  message: res.message,
                  type: 'error'
                })
              }
            }
          })
          return
        }
        vm.api.updateInsConf({
          data: {
            configurations: Object.values(vm.currentInsConfig)
          },
          beforeSend() {
            vm.confirmConfigLoading = true
          },
          complete() {
            vm.confirmConfigLoading = false
            vm.settingDialogVisible = false
          },
          success(res) {
            if (res.code === 0) {
              Notification({
                title: '修改成功',
                type: 'success'
              })
            } else {
              Notification({
                title: '修改失败',
                message: res.message,
                type: 'error'
              })
            }
          }
        })
      }
    },
    validateConfigItem(itemKey) {
      let vm = this
      let Validator = util.Validator
      let result = new Validator(
        vm.currentInsConfig[itemKey].value,
        vm.validators[itemKey]
      ).validate().result
      vm.currentInsConfig[itemKey].correct = result.valid
      vm.currentInsConfig[itemKey].warning = result.valid ? '' : result.message
      return result.valid
    },
    validateAllConfig() {
      let res = true
      if (this.mutiple) {
        for (let key in this.currentInsConfig) {
          if (this.currentInsConfig[key].value !== '') {
            if (!this.validateConfigItem(key)) {
              res = false
            }
          }
        }
      } else {
        for (let key in this.currentInsConfig) {
          if (!this.validateConfigItem(key)) {
            res = false
          }
        }
      }
      return res
    },
    toggleInstanceSelected() {
      if (this.dialogInstanceList.length > 0) {
        this.isAllChecked = this.dialogInstanceList.reduce((p, c) => {
          return c.selected && p
        }, true)
      } else {
        this.isAllChecked = false
      }
    },
    toggleAllDialogInstanceSelected(checked, e) {
      let keys = this.dialogInstanceList.map(instance => instance.id)
      this.originInstanceList.forEach(instance => {
        if (keys.indexOf(instance.id) > -1) {
          instance.selected = checked
        }
      })
    },
    /**
     * @description 获取探针设置对应的验证规则
     */
    getValidators() {
      this.api.getAgentConfigurationValidation().then(res => {
        if (res.data && res.data.length > 0) {
          this.validators = JSON.parse(res.data).validators
        }
      })
    }
  }
}
</script>
