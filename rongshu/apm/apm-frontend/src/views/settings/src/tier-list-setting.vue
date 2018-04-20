<style lang="scss" scoped>
@import "~vars";
.tier-list {
  .toolbar {
    float: right;
    margin-top: 10px;
    margin-right: $marginWidth;
    .add-btn {
      position: relative;
    }

    .search-input {
      position: relative;
      width: 200px;
      border-radius: 0px 4px 4px 0px;
      input.el-input__inner {
        border-radius: 0px 4px 4px 0px;
      }
    }
  }
}

.paginator {
  margin-top: 10px;
  text-align: right;
}

.downloadUrls {
  text-align: center;
}

.tier-name-modifying {
  padding-top: 5px;
}

.tier-name-modify-input {
  width: 100px;
}

.modifying-confirm-btn {
  margin-left: 5px;
}

.modifying-cancel-btn {
  position: relative;
  left: -5px;
}
</style>
<template>
  <setting-container @onContainerLoaded="onContainerLoaded">
    <div class="tier-list">
        <div class="content" ref="loadingContainer">
          <div class="header-title">
            <span class="title-name">Tier列表</span>
            <span class="toolbar">
              <el-button class="add-btn" icon="ion-plus-round" type="primary" size="mini" @click="createDialogVisible = true">
              </el-button>
              <el-input
                placeholder="请输入Tier名称"
                size="small"
                class="search-input"
                suffix-icon="el-icon-search"
                v-model="searchName">
              </el-input>
            </span>
          </div>
          <el-table
            :data="tierList"
            class="list-table"
            style="width: 100%">
            <el-table-column
              label="Tier">
              <template slot-scope="scope">
                <router-link v-show="!scope.row.modifying" :to="{name: 'instance-list-setting', query: Object.assign({}, {
                _tierId: scope.row.id,
                tierName: scope.row.name,
                tierType: scope.row.tierType,
                tierFilterName: searchName
              }, $route.query)}" class="theme-font-color-primary">
                  <span>{{ scope.row.name }}</span>
                </router-link>
                <div class="tier-name-modifying" v-show="scope.row.modifying">
                  <el-input v-model="scope.row.tempName" size="mini" class="tier-name-modify-input"
                            @change="validateName(scope)"></el-input>
                  <el-button class="modifying-confirm-btn" type="primary" size="mini" :loading="scope.row.loading"
                             @click="confirmModify(scope)">
                    <i class="ion-checkmark-round"></i>
                  </el-button>
                  <el-button class="modifying-cancel-btn" size="mini" @click="cancelModify(scope)">
                    <i class="ion-close-round"></i>
                  </el-button>
                  <div v-show="!scope.row.correct" class="theme-font-color-danger">{{ scope.row.warning }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="tierTypeName"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="instanceTotal"
              label="实例数量">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="renameTier(scope)">重命名</el-button>
                <el-button type="text" size="small" @click="downloadInstance(scope.row)">下载探针</el-button>
                <el-button type="text" size="small" @click="deleteTierConfirm(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="添加Tier" :visible.sync="createDialogVisible">
          <el-form :model="createForm" :rules="createRules" ref="createForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="createForm.name"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="createForm.tierType">
                <el-radio :label="item.type" v-for="(item,index) in createForm.TierTypes" :key="index">{{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="createForm.description" prop="description" :maxlength="80"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="createDialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="create">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="提示"
          :visible.sync="deleteDialogVisible"
          size="tiny">
          <span>确定要删除当前Tier吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteTier">确 定</el-button>
          </span>
        </el-dialog>
    </div>
  </setting-container>
</template>
<script>
import {
  Button,
  Table,
  TableColumn,
  Input,
  Form,
  FormItem,
  Dialog,
  Radio,
  RadioGroup,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Notification
} from 'element-ui'
import { nameValidator } from '_cbl'
import SettingContainer from './setting-container.vue'
import loadingMixin from '_components/mixin/loading.js'

export default {
  name: 'tier-list-setting',
  mixins: [loadingMixin],
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    SettingContainer
  },
  data() {
    return {
      originTierList: [],
      searchName: '',
      curTier: { name: '' },
      createDialogVisible: false,
      deleteDialogVisible: false,
      deleteTierId: null,
      createForm: {
        name: '',
        tierType: 1,
        TierTypes: [],
        description: ''
      },
      createRules: {
        name: [
          { required: true, message: '请输入Tier名称', trigger: 'blur' },
          { max: 10, message: 'Tier名称不能超过10个字符', trigger: 'blur' },
          { validator: nameValidator, trigger: 'blur' }
        ]
      },
      downloadDialogVisible: false
    }
  },
  computed: {
    tierList() {
      return this.originTierList.filter(tier => {
        if (tier.name === '__browser__') return false
        if (this.searchName) return tier.name.indexOf(this.searchName) !== -1
        else return true
      })
    }
  },
  watch: {
    searchName(v) {
      if (v) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            tierFilterName: this.searchName
          })
        })
      }
    }
  },
  methods: {
    onContainerLoaded(queryData) {
      this.getTierTypes()
      this.getTierList()
      this.searchName = this.$route.query.tierFilterName
    },
    create() {
      let vm = this
      vm.$refs.createForm.validate(res => {
        if (res) {
          vm.api.createTier({
            data: Object.assign(
              {
                applicationId: this.$root.eventBus.getCurSystem().id,
                tier_type: this.createForm.tierType
              },
              vm.createForm
            ),
            beforeSend() {
              vm.loading = true
            },
            complete() {
              vm.loading = false
            },
            success(res) {
              vm.createDialogVisible = false
              if (res.code === 0) {
                Notification({
                  title: '创建成功',
                  type: 'success'
                })
                vm.getTierList()
                vm.createForm.name = ''
                vm.createForm.description = ''
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
    getTierTypes() {
      this.api.getTierType().then(res => {
        if (res.code === 0) {
          // tierTypes中不需要展示出来浏览器类型
          this.createForm.TierTypes = res.data.filter(type => { return type.name.toLowerCase() !== 'browser' })
        }
      })
    },
    getTierList() {
      let vm = this
      vm.api.getTierListByApplicationId({
        data: {
          applicationId: this.$root.eventBus.getCurSystem().id
        },
        beforeSend() {
          vm.loading = true
        },
        complete() {
          vm.loading = false
        },
        success(res) {
          if (res.code === 0) {
            vm.originTierList = res.data.map((ins, index) => {
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
    downloadInstance(rowData) {
      window.open(
        window.$$apm.outerRemoteHost +
          '/agent/downloadAgent?applicationId=' +
          this.$root.eventBus.getCurSystem().id +
          '&tierId=' +
          rowData.id +
          '&type=' +
          rowData.tierType
      )
    },
    renameTier(scope) {
      console.log(scope)
      scope.row.modifying = true
      scope.row.tempName = scope.row.name
      this.$nextTick(() => {
        $($('.tier-name-modifying')[scope.$index])
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
        vm.api.updateTierName({
          data: {
            id: scope.row.id,
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
    deleteTierConfirm(scope) {
      this.deleteDialogVisible = true
      this.deleteTierId = scope.row.id
    },
    deleteTier() {
      let that = this
      that.api
        .deleteTier({
          data: {
            id: that.deleteTierId
          }
        })
        .then(function() {
          that.deleteDialogVisible = false
          that.deleteTierId = null
          that.getTierList()
        })
    }
  }
}
</script>
