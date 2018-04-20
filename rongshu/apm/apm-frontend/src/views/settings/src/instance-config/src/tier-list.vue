<style lang="scss" scoped>
.search-input {
  position: relative;
  width: 250px;
}

.paginator {
  margin-top: 10px;
  text-align: right;
}

.downloadUrls {
  text-align: center;
}

.breadcrumb {
  display: inline-block;
  position: relative;
  bottom: -7px;
}
.right-info {
  margin-top: 10px;
}
</style>
<template>
  <div class="common-container">
    <div class="header-title">
      <span class="title-name"><el-breadcrumb class="breadcrumb">
          <el-breadcrumb-item :to="{
          name: 'settings-app-list',
          query: {
            applicationFilterName: $route.query.applicationFilterName
          }
        }">
            <span>{{ $route.query.applicationName }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>tier列表</el-breadcrumb-item>
        </el-breadcrumb></span>
      <div class="right-info">
        <div class="theme-border-color-base">
        <el-button class="add-btn" icon="ion-plus-round" type="primary" size="small" @click="createDialogVisible = true">
        </el-button>
        <el-input
          placeholder="请输入Tier名称"
          prefix-icon="el-icon-search"
          size="small"
          class="search-input"
          v-model="searchName">
        </el-input>
      </div>
      </div>
    </div>
    <div class="tier-list content">
        <div ref="tableContainer">
          <el-table
            :data="tierList"
            class="list-table"
            style="width: 100%">
            <el-table-column
              label="Tier">
              <template slot-scope="scope">
                <router-link :to="{name: 'settings-instance-list', query: Object.assign({}, {
                tierId: scope.row.id,
                tierType: scope.row.tierType,
                tierName: scope.row.name,
                tierFilterName: searchName
              }, $route.query)}" class="theme-font-color-primary">
                  <span>{{ scope.row.name }}</span>
                </router-link>
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
                <el-button type="text" size="small" @click="downloadInstance(scope.row)">下载新探针</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            class="paginator"
            layout="total, prev, pager, next"
            :total="paginator.total"
            :current-page.sync="paginator.currentPage">
          </el-pagination> -->
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
            <el-button type="primary" :loading="creatingLoading" @click="create">确定</el-button>
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
  Input,
  Form,
  FormItem,
  Dialog,
  Radio,
  RadioGroup,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  Notification,
  Loading
} from 'element-ui'
import { nameValidator } from '_cbl'

export default {
  name: 'tier-list',
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
    'el-breadcrumb-item': BreadcrumbItem
  },
  mounted() {
    this.getTierTypes()
    this.getTierList()
    this.searchName = this.$route.query.tierFilterName
  },
  data() {
    return {
      currTier: {},
      originTierList: [],
      searchName: '',
      createDialogVisible: false,
      createForm: {
        name: '',
        tierType: 1,
        TierTypes: [],
        description: ''
      },
      creatingLoading: false,
      createRules: {
        name: [
          { required: true, message: '请输入Tier名称', trigger: 'blur' },
          { max: 80, message: 'Tier名称不能超过80个字符', trigger: 'blur' },
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
            applicationFilterName: this.searchName
          })
        })
      }
    }
  },
  methods: {
    create() {
      let vm = this
      vm.$refs.createForm.validate(res => {
        if (res) {
          vm.api.createTier({
            data: Object.assign(
              {
                applicationId: vm.$route.query.applicationId,
                tier_type: this.createForm.tierType
              },
              vm.createForm
            ),
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
          this.createForm.TierTypes = res.data
        }
      })
    },
    getTierList() {
      let vm = this
      let loading = null
      vm.api.getTierListByApplicationId({
        data: {
          applicationId: vm.$route.query.applicationId
          // pageSize: vm.paginator.pageSize,
          // pageIndex: vm.paginator.currentPage - 1
        },
        beforeSend() {
          loading = Loading.service({
            target: vm.$refs.tableContainer
          })
        },
        complete() {
          loading.close()
          loading = null
        },
        success(res) {
          if (res.code === 0) {
            vm.originTierList = res.data
            // vm.paginator.total = res.data.total
          }
        }
      })
    },

    downloadInstance(rowData) {
      window.open(
        window.$$apm.outerRemoteHost +
          '/agent/downloadAgent?applicationId=' +
          this.$route.query.applicationId +
          '&tierId=' +
          rowData.id +
          '&type=' +
          rowData.tierType
      )
    }
  }
}
</script>
