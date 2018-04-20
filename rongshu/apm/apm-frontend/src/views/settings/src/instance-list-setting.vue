<style lang="scss" scoped>
@import "~vars";
.apm-table-bordered {
  border: 1px solid #dcdcdc;
  border-radius: 2px;
}
.instance-list {
  .toolbar {
    float: right;
    margin-top: 10px;
    margin-right: $marginWidth;
    .mutiple-setting-btn {
      position: relative;
    }

    .search-input {
      position: relative;
      width: 200px;
    }
  }
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
</style>

<template>
<setting-container @onContainerLoaded="onContainerLoaded">
  <div class="instance-list">
    <div class="content">
      <div class="header-title">
        <el-breadcrumb class="breadcrumb">
          <el-breadcrumb-item :to="{ name: 'tier-list-setting', query: {
              tierFilterName: $route.query.tierFilterName
            }}">{{ $route.query.tierName }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>实例列表</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="toolbar">
          <el-button class="mutiple-setting-btn" icon="ion-gear-b" type="primary" size="mini" @click="getMutiInstances()">
            批量设置
          </el-button>
          <el-input placeholder="请输入实例名称"  size="small" class="search-input" v-model="searchName">
          </el-input>
        </span>
      </div>
      <div ref="loadingContainer" style="position: relative;">
        <el-table :data="instanceList" class="list-table" style="width: 100%">
          <el-table-column width="80" label="状态">
            <div slot-scope="scope" style="text-align: center;">
              <el-tag :type="statusMap[scope.row.status]?statusMap[scope.row.status].color:''">{{ scope.row.status?statusMap[scope.row.status].text:'' }}</el-tag>
            </div>
          </el-table-column>
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
            <el-table-column prop="lastHealthCheckTime" width="140" label="最后一次心跳时间">
            </el-table-column>
            <el-table-column prop="address" label="宿主机地址">
            </el-table-column>
            <el-table-column width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getInstanceConfig(scope)">
                  配置</el-button>
              </template>
            </el-table-column>
            <el-table-column width="120" label="禁用/启用">
              <template slot-scope="scope">
                <div ref="switchContainer" class="switch-container">
                  <el-switch :active-text="scope.row.loading ? '...' : undefined" :inactive-text="scope.row.loading ? '...' : undefined" v-model="originInstanceList[scope.row.index].enabled" @change="toggleInstance(originInstanceList[scope.row.index])"></el-switch>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
    <setting-dialog
      :instances="instanceList"
      :show="settingDialog.show"
      :mutiple="settingDialog.mutiple"
      :tier-id="settingDialog.tierId"
      :instance-id="settingDialog.instanceId"
      :instance-type="settingDialog.instanceType"
      @update:show="val => settingDialog.show = val">
    </setting-dialog>
  </div>
</setting-container>
</template>

  <script>
import { nameValidator } from '_cbl'
import SettingContainer from './setting-container.vue'
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
  Notification
} from 'element-ui'
import loadingMixin from '_components/mixin/loading.js'
import settingDialog from './setting-dialog.vue'
export default {
  name: 'instance-list',
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
    'setting-dialog': settingDialog,
    SettingContainer
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
      tempModifyingName: '',
      searchName: '',
      settingDialog: {
        show: false,
        mutiple: false,
        instanceId: '',
        tierId: this.$route.query._tierId,
        instanceType: this.$route.query.tierType
      }
    }
  },
  computed: {
    instanceList() {
      return this.originInstanceList.filter(tier => {
        if (this.searchName) return tier.name.indexOf(this.searchName) !== -1
        else return true
      })
    }
  },
  methods: {
    onContainerLoaded() {
      this.getInstanceList()
    },
    getInstanceList() {
      let vm = this
      vm.api.getInstanceList({
        data: {
          tierId: this.$route.query._tierId
        },
        beforeSend() {
          vm.loading = true
        },
        complete() {
          vm.loading = false
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
                  warning: ''
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
        console.log(scope)
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
      this.settingDialog.instanceId = scope.row.id
      this.settingDialog.mutiple = false
      this.settingDialog.show = true
    },
    getMutiInstances() {
      this.settingDialog.mutiple = true
      this.settingDialog.instanceId = ''
      this.settingDialog.show = true
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
    }
  }
}
</script>
