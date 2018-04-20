<style lang="scss">
@import "~vars";

.settings-app-list {
  .search-input {
    position: relative;
    width: 250px;
  }
  .paginator {
    margin-top: 10px;
    text-align: right;
  }
  .config-type {
    margin-left: 5px;
  }
  .config-switch {
    position: relative;
    bottom: -4px;
  }
  .label-things {
    display: inline-block;
  }
  .required-mark {
    font-size: $font-size-huge;
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }

  .el-dialog {
    max-width: 600px;
  }
  .right-info {
    margin-top: 10px;
  }
}
</style>
<template>
  <div class="settings-app-list">
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">应用列表</span>
        <div class="right-info">
          <div class="theme-border-color-base">
          <el-button icon="ion-plus-round" type="primary" size="small" @click="createDialogVisible = true">
          </el-button>
          <el-input placeholder="请输入应用名称" prefix-icon="el-icon-search" size="small" class="search-input" v-model="searchName">
          </el-input>
        </div>
        </div>
      </div>
      <div ref="tableContainer" class="content">
        <el-table :data="appList" row-key="id" class="list-table" style="width: 100%">
          <el-table-column label="应用">
            <template slot-scope="scope">
              <router-link :to="{name: 'settings-tier-list', query: {
                        applicationId: scope.row.id,
                        applicationName: scope.row.name,
                        applicationFilterName: searchName
                      }}" class="theme-font-color-primary">
                {{ scope.row.name }}

              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="tierTotal" label="tier数量">
            <template slot-scope="scope">
              {{ scope.row.tierTotal}}

            </template>
          </el-table-column>
          <el-table-column prop="instanceTotal" label="实例数量">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="getAppConf(scope.row)">配置</el-button>
              <el-button type="text" size="small" @click="startDownload(scope.row)">获取Web探针</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
                  class="paginator"
                  layout="total, prev, pager, next"
                  :total="paginator.total"
                  :page-size="paginator.pageSize"
                  @current-change="getApplicationList"
                  :current-page.sync="paginator.currentPage">
                </el-pagination> -->
      </div>

      <el-dialog title="应用配置" :visible.sync="configDialogVisible">
        <div ref="configFormContainer" style="position: relative;">
          <el-form ref="configForm" :model="configForm" :rules="configRules">
            <el-tabs class="tabs" :value="configTabsValue">
              <el-tab-pane name="common" label="通用" style="padding-right:20px;">
                <el-form-item v-for="(configKey, index) in configIndexMap" :key="index"
                              :label="configMap[configKey].name" :prop="configKey" v-if="configMap[configKey].type==0"
                              label-width="100px">
                  <el-input v-if="typeof configForm[configKey] != 'boolean'"
                            :maxlength="configMap[configKey].name=='ApdexT'?8:5000" v-model="configForm[configKey]"
                            @change="configMap[configKey].value = configForm[configKey]" size="small"></el-input>

                </el-form-item>
              </el-tab-pane>
              <el-tab-pane name="java" label="Java"  style="padding-right:20px;">
                <el-form-item v-for="(configKey, index) in configIndexMap" :key="index"
                              :label="configMap[configKey].name" :prop="configKey" v-if="configMap[configKey].type==1"
                              label-width="160px">
                  <el-input v-if="typeof configForm[configKey] != 'boolean'" v-model="configForm[configKey]"
                            @change="configMap[configKey].value = configForm[configKey]" size="small"></el-input>
                  <el-switch class="config-switch" v-if="typeof configForm[configKey] === 'boolean'"
                             v-model="configForm[configKey]"
                             @change="(v)=>{configMap[configKey].value = (String(v)).toLowerCase()}"
                  ></el-switch>
                </el-form-item>
                <div class="custom-config-table" style="display:none;">
                  <el-table :data="customConfigList" class="apm-table-bordered"  style="width: 100%; height: 100%;">
                    <el-table-column property="className" label="类名" width="150">
                      <template slot-scope="scope">
                        <el-input
                          size="mini"
                          v-model="scope.row.className.value"
                          @change="validateConfigItem(scope.row.className, 'className')">
                        </el-input>
                        <div class="warning theme-font-color-danger" v-show="!scope.row.className.correct">
                          {{ scope.row.className.warning }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column property="methodName" label="方法名" width="150">
                      <template slot-scope="scope">
                        <el-input
                          size="mini"
                          v-model="scope.row.methodName.value"
                          @change="validateConfigItem(scope.row.methodName, 'methodName')">
                        </el-input>
                        <div class="warning theme-font-color-danger" v-show="!scope.row.methodName.correct">
                          {{ scope.row.methodName.warning }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column property="description" label="描述" width="150">
                      <template slot-scope="scope">
                        <el-input
                          size="mini"
                          v-model="scope.row.description">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column property="containSubClass" label="包含子类" align="center">
                      <template slot-scope="scope">
                        <el-checkbox
                          size="mini"
                          v-model="scope.row.containSubClass">
                        </el-checkbox>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="text-align:center;"><el-button size="mini" type="text" @click="appendCustomMethod" icon="el-icon-plus">添加自定义方法</el-button></div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="browser" label="Browser"   style="padding-right:20px;">
                <el-form-item v-for="(configKey, index) in configIndexMap" :key="index"
                              :label="configMap[configKey].name" :prop="configKey" v-if="configMap[configKey].type==3"
                              label-width="180px">
                  <el-input v-if="typeof configForm[configKey] != 'boolean'" v-model="configForm[configKey]"
                            @change="configMap[configKey].value = configForm[configKey]" size="small"></el-input>
                  <el-switch class="config-switch" v-if="typeof configForm[configKey] === 'boolean'"
                             v-model="configForm[configKey]"
                             @change="(v)=>{configMap[configKey].value = (String(v)).toLowerCase()}"
                  ></el-switch>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="configDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="modifyConfig">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加应用" :visible.sync="createDialogVisible">
        <el-form :model="createForm" :rules="createRules" ref="createForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="createForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="createForm.description" prop="description" :maxlength="80"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="creatingLoading" @click="create">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="获取Web探针" :visible.sync="downloadDialogVisible">
        <div>
          {{ currentDownload }}

        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  Button,
  Table,
  TableColumn,
  Tag,
  Tabs,
  TabPane,
  Input,
  Form,
  FormItem,
  Dialog,
  Pagination,
  Notification,
  Loading,
  Switch,
  Checkbox
} from 'element-ui'
import {
  nameValidator,
  configItemValidators,
  customConfigItemValidators,
  appConfig,
  configTypeMap,
  configIndexMap
} from '_cbl'

export default {
  name: 'app-list',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-tag': Tag,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-switch': Switch,
    'el-checkbox': Checkbox
  },
  mounted() {
    this.getApplicationList()
    this.configMap2ConfigForm()
    this.searchName = this.$route.query.applicationFilterName
  },
  data() {
    return {
      originAppList: [],
      currApp: {},
      applistLoading: false,
      paginator: {
        pageSize: 20,
        currentPage: 1,
        total: 50
      },
      searchName: '',
      configTabsValue: 'common',
      configDialogVisible: false,
      createDialogVisible: false,
      // 傻逼element-ui表单验证不支持表单项是对象， 只能是字面量，所以这里保存引用避免循环
      configMap: _.cloneDeep(appConfig),
      configTypeMap: _.cloneDeep(configTypeMap),
      configIndexMap: _.cloneDeep(configIndexMap),
      configForm: {},
      configRules: configItemValidators,
      createForm: {
        name: '',
        description: ''
      },
      creatingLoading: false,
      createRules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
          { max: 80, message: '应用名称不能超过80个字符', trigger: 'blur' },
          { validator: nameValidator, trigger: 'blur' }
        ]
      },
      downloadDialogVisible: false,
      currentDownload: '',
      customConfigList: []
    }
  },
  computed: {
    appList() {
      return this.originAppList.filter(app => {
        if (this.searchName) return app.name.indexOf(this.searchName) !== -1
        else return true
      })
    }
  },
  watch: {
    configMap: {
      deep: true,
      handler(v) {
        this.configMap2ConfigForm()
      }
    },
    searchName(v) {
      this.$router.push({
        query: {
          applicationFilterName: this.searchName
        }
      })
    }
  },
  methods: {
    create() {
      let vm = this
      vm.$refs.createForm.validate(res => {
        if (res) {
          vm.api.createApplication({
            data: vm.createForm,
            beforeSend() {
              vm.creatingLoading = true
            },
            complete() {
              vm.creatingLoading = false
            },
            success(res) {
              vm.createDialogVisible = false
              if (res.code === 0) {
                Notification({
                  title: '创建成功',
                  type: 'success'
                })
                vm.getApplicationList()
                vm.createForm = {
                  name: '',
                  description: ''
                }
              } else {
                Notification({
                  title: '创建失败',
                  message: res.message,
                  type: 'error'
                })
              }
            }
          })
        }
      })
    },
    getApplicationList() {
      let vm = this
      let appListLoading = null
      vm.api.getApplicationList({
        data: {
          pageSize: vm.paginator.pageSize,
          pageIndex: vm.paginator.currentPage - 1
        },
        beforeSend() {
          appListLoading = Loading.service({
            target: vm.$refs.tableContainer
          })
        },
        complete() {
          appListLoading.close()
          appListLoading = null
        },
        success(res) {
          if (res.code === 0) {
            let origin =
              window.location.protocol +
              '//' +
              window.location.hostname +
              ':' +
              window.location.port
            vm.originAppList = res.data.applicationHierarchy.map(app => {
              return Object.assign(
                {
                  /* eslint-disable no-useless-escape */
                  webProbe: `<script src="${origin}\/js-sdks\/${app.name}.js"><\/script>`
                },
                app
              )
            })
            vm.paginator.total = res.data.total
          }
        }
      })
    },
    getAppConf(app) {
      let vm = this
      vm.currApp = app
      vm.configDialogVisible = true
      let configLoading = null
      vm.api.getAppConf({
        data: {
          applicationId: app.id
        },
        beforeSend() {
          configLoading = Loading.service({
            target: vm.$refs.configFormContainer
          })
        },
        complete() {
          configLoading.close()
        },
        success(res) {
          if (res.code === 0) {
            // 格式化数据
            res.data.forEach(item => {
              let key = item.key.replace(/\./g, '_')
              vm.configMap[key] = Object.assign({}, vm.configMap[key], item)
            })
          }
        }
      })
      // vm.api.getCustomMethodConfigs({
      //   data: {
      //     applicationId: app.id
      //   },
      //   success(res) {
      //     if (res.code === 0) {
      //       // 格式化数据
      //       vm.customConfigList = res.data.map(item => {
      //         Object.keys(item).forEach(propName => {
      //           if (propName === 'className' || propName === 'methodName') {
      //             item[propName] = {
      //               value: item[propName],
      //               correct: true,
      //               warning: ''
      //             }
      //           }
      //         })
      //         return item
      //       })
      //     }
      //   }
      // })
    },
    configMap2ConfigForm() {
      let form = {}
      for (let key in this.configMap) {
        form[key] = this.configMap[key].isBoolean
          ? this.configMap[key].value.toString() === 'true'
          : this.configMap[key].value
      }
      this.configForm = form
    },
    modifyConfig() {
      let vm = this
      this.$refs.configForm.validate(res => {
        if (res) {
          vm.api.updateAppConf({
            data: {
              applicationName: vm.currApp.name,
              configurations: Object.values(vm.configMap)
            },
            beforeSend() {
              vm.updateLoading = true
            },
            complete() {
              vm.updateLoading = false
            },
            success(res) {
              if (res.code === 0) {
                vm.configDialogVisible = false
                Notification({
                  title: '修改成功',
                  type: 'success'
                })
                vm.getApplicationList()
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
      })
    },
    startDownload(app) {
      this.currApp = app
      this.currentDownload = ''
      this.downloadDialogVisible = true
      for (let a of this.appList) {
        if (a.id === app.id) {
          this.currentDownload = app.webProbe
          break
        }
      }
    },
    onSwitchChange() {
      console.log(arguments)
    },
    appendCustomMethod() {
      this.customConfigList.push({
        className: {
          value: '',
          correct: true,
          warning: ''
        },
        methodName: {
          value: '',
          correct: true,
          warning: ''
        },
        containSubClass: false,
        description: ''
      })
    },
    validateConfigItem(item, itemKey) {
      let validatorObj = customConfigItemValidators[itemKey] ? customConfigItemValidators[itemKey][1] : null
      if (validatorObj && typeof validatorObj.validator === 'function') {
        return validatorObj.validator(
          {},
          item.value,
          res => {
            if (res instanceof Error) {
              item.warning = res.toString().substring(7)
              item.correct = false
            } else {
              item.correct = true
            }
            return item.correct
          })
      } else {
        item.correct = true
        return item.correct
      }
    }
  }
}
</script>
