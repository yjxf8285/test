<style lang="scss" scoped>
.add-btn {
  position: relative;
  float: right;
  margin-left: 10px;
}
.el-button--small {
  padding: 5px 9px 6px 9px;
}
.mutiple-setting-btn {
  position: relative;
  margin-right: 10px;
  float: right;
}

.search-input {
  position: relative;
  width: 250px;
  float: right;
}

.paginator {
  margin-top: 10px;
  text-align: right;
}

.breadcrumb {
  display: inline-block;
  position: relative;
  bottom: -7px;
}

.instance-name-modifying {
  padding-top: 5px;
}

.instance-name-modify-input {
  width: 200px;
}

.modifying-confirm-btn {
  margin-left: 5px;
}

.modifying-cancel-btn {
  position: relative;
  left: -5px;
}

.config-table-container {
  position: relative;
}

.warning {
  // display: inline-block;
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}

.slide-enter-active,
.slide-leave-active {
  transform: translateY(0);
  opacity: 1;
}

.slide-enter,
.slide-leave-to,
.slide-leave-active {
  transform: translateY(-6px);
  opacity: 0;
}

.switch-container {
  position: relative;
}

.setting-layout {
  position: static;
  display: flex;
  width: 100%;
  .instance-list {
    width: 300px;
    padding-right: 5px;
    .el-table {
      border: 1px solid #dcdcdc;
      border-width: 0px 1px;
    }
    .instance-list-footer {
      height: 36px;
      line-height: 36px;
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
    overflow: auto;
  }
}
</style>
<template>
  <div class="common-container">
    <div class="instance-list content">
      <div class="operation-bar theme-border-color-base">
        <el-breadcrumb class="breadcrumb">
          <el-breadcrumb-item :to="{ name: 'settings-app-list', query: {
            applicationFilterName: $route.applicationFilterName
          }}">{{ $route.query.applicationName }}

          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'settings-tier-list', query: {
            tierFilterName: $route.query.tierFilterName,
            applicationId: $route.query.applicationId,
            applicationName: $route.query.applicationName,
            applicationFilterName: $route.query.applicationFilterName
          }}">{{ $route.query.tierName }}

          </el-breadcrumb-item>
          <el-breadcrumb-item>实例列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <el-button class="add-btn" size="small" type="primary" @click="createDialogVisible = true">
            <i class="ion-plus-round"></i>
          </el-button> -->
        <el-input placeholder="请输入实例名称" prefix-icon="el-icon-search" size="small" class="search-input" v-model="searchName">
        </el-input>
        <el-button class="mutiple-setting-btn" type="primary" size="small" @click="getMutiInstancesConfig()">
          <i class="ion-gear-b"></i>批量配置
        </el-button>
      </div>

        <div ref="tableContainer" style="position: relative;">
          <el-table :data="instanceList" class="list-table" style="width: 100%">
            <el-table-column label="实例">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="点击修改实例名称" placement="right">
                  <span class="theme-font-color-primary" v-show="!scope.row.modifying"
                        @click="intoModifying(scope)">{{ scope.row.name }}</span>
                </el-tooltip>
                <div class="instance-name-modifying" v-show="scope.row.modifying">
                  <el-input v-model="scope.row.tempName" size="mini" class="instance-name-modify-input"
                            @change="validateName(scope)"></el-input>
                  <el-button class="modifying-confirm-btn" type="primary" size="mini" :loading="scope.row.loading"
                             @click="confirmModify(scope)" :disabled="!scope.row.tempName.length">
                    <i class="ion-checkmark-round"></i>
                  </el-button>
                  <el-button class="modifying-cancel-btn" size="mini" @click="cancelModify(scope)">
                    <i class="ion-close-round"></i>
                  </el-button>
                  <div v-show="!scope.row.correct" class="theme-font-color-danger">{{ scope.row.warning }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="主机:端口">

            </el-table-column>
            <el-table-column width="120" label="状态">
              <template slot-scope="scope">
                <el-tag :type="statusMap[scope.row.status].color">{{ statusMap[scope.row.status].text }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getInstanceConfig(scope)">配置</el-button>
              </template>
            </el-table-column>
            <el-table-column width="120" label="禁用/启用">
              <template slot-scope="scope">
                <div ref="switchContainer" class="switch-container">
                  <el-switch :active-text="scope.row.loading ? '...' : undefined"
                             :inactive-text="scope.row.loading ? '...' : undefined"
                             v-model="originInstanceList[scope.row.index].enabled"
                             @change="toggleInstance(originInstanceList[scope.row.index])"></el-switch>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :width="mutiConfig? '80%' : '50%'" title="实例配置" :visible.sync="configDialogVisible">
          <div class="setting-layout" :class="{'mutiple-style': mutiConfig}" ref="configContainer">
            <div class="instance-list" v-show="mutiConfig">
              <div class="toolbar">
                <el-input class="apm-input-border-radius__4-4-0-0" placeholder="请输入要检索的实例名称" prefix-icon="el-icon-search" v-model="dialogSearchName"></el-input>
              </div>
              <el-table ref="instanceTable" :data="dialogInstanceList" style="width: 100%" height="428" :show-header="false">
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
            <div class="config-table">
              <el-table :data="configTableList" class="apm-table-bordered"  style="width: 100%" :height="mutiConfig ? 504:''">
                <el-table-column property="configName" label="配置名称" width="150"></el-table-column>
                <el-table-column property="appConfig" label="应用配置" width="150">
                  <template slot-scope="scope">
                    {{ typeof scope.row.appConfig === 'boolean' ? (scope.row.appConfig ? 'ON' : 'OFF') : scope.row.appConfig}}
                  </template>
                </el-table-column>
                <el-table-column label="实例配置" property="key">
                  <template slot-scope="scope">
                    <div style="padding-top: 5px;">
                      <el-input v-if="!currentInsConfig[scope.row.key].isBoolean" size="mini"
                                class="config-input" v-model="currentInsConfig[scope.row.key].value"
                                @change="validateConfigItem(scope.row.key)"></el-input>
                      <el-switch class="config-switch"
                                v-if="currentInsConfig[scope.row.key].isBoolean"
                                v-model="currentInsConfig[scope.row.key].value"></el-switch>
                      <div class="warning theme-font-color-danger" v-show="!currentInsConfig[scope.row.key].correct">
                          {{ currentInsConfig[scope.row.key].warning }}
                        </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="configDialogVisible = false"  size="mini">取消</el-button>
            <el-button type="primary" :loading="confirmConfigLoading" @click="confirmConfig" size="mini">确定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  nameValidator,
  configItemValidators,
  appConfig,
  configIndexMap
} from '_cbl'

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
  Loading,
  Checkbox
} from 'element-ui'

export default {
  name: 'instance-list',
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
  mounted() {
    this.getInstanceList()
  },
  data() {
    return {
      statusMap: {
        '-3': {
          text: '错误',
          color: 'danger'
        },
        '-2': {
          text: '失联',
          color: 'danger'
        },
        '-1': {
          text: '禁用',
          color: 'gray'
        },
        '0': {
          text: '初始化',
          color: 'warning'
        },
        '1': {
          text: '活跃',
          color: 'success'
        }
      },
      originInstanceList: [],
      mutiConfig: false,
      isAllChecked: false,
      dialogSearchName: '',
      tempModifyingName: '',
      allDialogInstanceSelected: false,
      paginator: {
        currentPage: 1,
        total: 50
      },
      searchName: '',
      configDialogVisible: false,
      appConfig: _.cloneDeep(appConfig),
      configIndexMap: _.cloneDeep(configIndexMap),
      currentInsConfig: _.cloneDeep(appConfig),
      confirmConfigLoading: false,
      tempActiveStatus: false,
      configItemValidators: configItemValidators
    }
  },
  watch: {
    configDialogVisible(v) {
      // 关闭时，清空实例选择列表的选中项
      if (!v) {
        this.originInstanceList.forEach(
          instance => (instance.selected = false)
        )
        this.isAllChecked = false
      }
    }
  },
  computed: {
    instanceList() {
      return this.originInstanceList.filter(tier => {
        if (this.searchName) return tier.name.indexOf(this.searchName) !== -1
        else return true
      })
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
    },
    configTableList() {
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
      return res
    }
  },
  methods: {
    getInstanceList() {
      let vm = this
      let loading = null
      vm.api.getInstanceList({
        data: {
          tierId: this.$route.query.tierId
        },
        beforeSend() {
          loading = Loading.service({
            target: vm.$refs.tableContainer
          })
        },
        complete() {
          loading.close()
        },
        success(res) {
          if (res.code === 0) {
            vm.originInstanceList = res.data.map((ins, index) => {
              return Object.assign(
                {
                  index,
                  modifying: false,
                  tempName: '',
                  loading: false,
                  correct: true,
                  warning: '',
                  selected: false
                },
                ins
              )
            })
          }
        }
      })
    },
    intoModifying(scope) {
      scope.row.modifying = true
      scope.row.tempName = scope.row.name
      this.$nextTick(() => {
        $($('.instance-name-modifying')[scope.$index])
          .find('input')[0]
          .focus()
      })
    },
    cancelModify(scope) {
      scope.row.modifying = false
      scope.row.correct = true
    },
    validateName(scope) {
      return nameValidator({}, scope.row.tempName, res => {
        if (res instanceof Error) {
          scope.row.warning = res.toString().substring(7)
          return (scope.row.correct = false)
        } else {
          return (scope.row.correct = true)
        }
      })
    },
    confirmModify(scope) {
      let vm = this
      if (vm.validateName(scope)) {
        vm.api.updateInstanceName({
          data: {
            id: scope.row.id, // TODO:
            name: scope.row.tempName
          },
          beforeSend() {
            scope.row.loading = true
          },
          complete() {
            scope.row.loading = false
          },
          success(res) {
            if (res.code === 0) {
              scope.row.modifying = false
              scope.row.name = scope.row.tempName
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
    getInstanceConfig(scope) {
      let vm = this
      vm.mutiConfig = false
      vm.configDialogVisible = true
      let ajaxCount = 0
      let loading = null
      vm.api.getAppConf({
        data: {
          applicationId: vm.$route.query.applicationId
        },
        beforeSend() {
          ajaxCount++
          if (!loading) {
            loading = Loading.service()
          }
        },
        complete() {
          ajaxCount--
          if (ajaxCount <= 0) {
            loading.close()
          }
        },
        success(res) {
          if (res.code === 0) {
            // 格式化数据
            res.data.forEach(item => {
              let key = item.key.replace(/\./g, '_')
              vm.appConfig[key] = Object.assign({}, vm.appConfig[key], item)
            })
          }
        }
      })
      vm.api.getInsConfig({
        data: {
          id: scope.row.id,
          type: scope.row.type
        },
        beforeSend() {
          ajaxCount++
          if (!loading) {
            loading = Loading.service()
          }
        },
        complete() {
          ajaxCount--
          if (ajaxCount <= 0) {
            loading.close()
          }
        },
        success(res) {
          if (res.code === 0) {
            // 格式化数据
            let temp = {}
            res.data.forEach(item => {
              let key = item.key.replace(/\./g, '_')
              temp[key] = {}
              for (let k in item) {
                temp[key][k] = item[k]
              }
              if (vm.appConfig[key]) {
                temp[key].type = vm.appConfig[key].type
                temp[key].isBoolean = vm.appConfig[key].isBoolean
                if (vm.appConfig[key].isBoolean) {
                  temp[key].value = item.value === 'true'
                }
              }
            })
            vm.currentInsConfig = temp
          }
        }
      })
    },
    getMutiInstancesConfig() {
      let vm = this
      vm.mutiConfig = true
      vm.configDialogVisible = true
      let ajaxCount = 0
      let loading = null
      vm.api.getAppConf({
        data: {
          applicationId: vm.$route.query.applicationId,
          type: vm.$route.query.tierType
        },
        beforeSend() {
          ajaxCount++
          if (!loading) {
            loading = Loading.service()
          }
        },
        complete() {
          ajaxCount--
          if (ajaxCount <= 0) {
            loading.close()
          }
        },
        success(res) {
          if (res.code === 0) {
            // 格式化数据
            res.data.forEach(item => {
              let key = item.key.replace(/\./g, '_')
              vm.appConfig[key] = Object.assign({}, vm.appConfig[key], item)
              let temp = _.cloneDeep(vm.appConfig)
              Object.keys(temp).forEach(key => {
                // if (temp[key].isBoolean) {
                //   temp[key].value = temp[key].value === 'true'
                // }
                // 不管什么类型数据，全都赋值为空
                temp[key].value = ''
              })
              vm.currentInsConfig = temp
            })
          }
        }
      })
    },
    confirmConfig() {
      let vm = this
      if (vm.validateAllConfig()) {
        // 验证通过
        if (vm.mutiConfig) {
          let selectedInstances = []
          this.originInstanceList.forEach(instance => {
            if (instance.selected) {
              selectedInstances.push(instance.id)
            }
          })
          if (selectedInstances.length === 0) {
            Notification({
              title: '提示',
              message: '请选择要更新的实例',
              type: 'warning'
            })
            return
          }
          vm.api.updateMutiInsConf({
            data: {
              type: vm.$route.query.tierType,
              configurations: Object.values(vm.currentInsConfig).filter(prop => prop.value !== ''),
              instanceIds: selectedInstances
            },
            beforeSend() {
              vm.confirmConfigLoading = true
            },
            complete() {
              vm.confirmConfigLoading = false
            },
            success(res) {
              if (res.code === 0) {
                vm.configDialogVisible = false
                Notification({
                  title: '批量修改成功',
                  type: 'success'
                })
              } else {
                Notification({
                  title: '批量修改失败',
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
          },
          success(res) {
            if (res.code === 0) {
              vm.configDialogVisible = false
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
      // 为空不验证验证
      if (!vm.currentInsConfig[itemKey].value) {
        return (vm.currentInsConfig[itemKey].correct = true)
      }
      if (
        itemKey === 'kepler_data_buffer_size' ||
        itemKey === 'kepler_data_send_period' ||
        itemKey === 'kepler_data_send_batch_size'
      ) {
        return true
      }

      let validatorObj = vm.configItemValidators[itemKey] ? vm.configItemValidators[itemKey][1] : null

      if (validatorObj && typeof validatorObj.validator === 'function') {
        return validatorObj.validator(
          {},
          vm.currentInsConfig[itemKey].value,
          res => {
            if (res instanceof Error) {
              vm.currentInsConfig[itemKey].warning = res.toString().substring(7)
              vm.currentInsConfig[itemKey].correct = false
            } else {
              vm.currentInsConfig[itemKey].correct = true
            }
            return vm.currentInsConfig[itemKey].correct
          })
      } else {
        vm.currentInsConfig[itemKey].correct = true
        return vm.currentInsConfig[itemKey].correct
      }
    },
    /**
     * @description 验证所有的配置项
     * 批量设置时，对于没设置值的项不进行规则校验
     *
     */
    validateAllConfig() {
      let res = true
      for (let key in this.currentInsConfig) {
        if (this.mutiConfig) {
          if (this.currentInsConfig[key].value) {
            res = this.validateConfigItem(key)
            if (!res) {
              console.log('校验失败：' + key)
              return res
            }
          }
        } else {
          res = this.validateConfigItem(key)
          if (!res) {
            console.log('校验失败：' + key)
            return res
          }
        }
      }
      return res
    },
    toggleInstance(ins) {
      let vm = this
      vm.api.updateInstanceEnabled({
        data: {
          id: ins.id,
          enabled: ins.enabled
        },
        beforeSend() {
          ins.loading = true
        },
        complete() {
          ins.loading = false
        },
        success(res) {
          if (res.code === 0) {
            Notification({
              title: ins.enabled ? '启用成功' : '禁用成功',
              type: 'success'
            })
          } else {
            Notification({
              title: ins.enabled ? '启用失败' : '禁用失败',
              message: res.message,
              type: 'error'
            })
            ins.enabled = !ins.enabled
          }
        },
        error() {
          ins.enabled = !ins.enabled
        }
      })
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
    }
  }
}
</script>
