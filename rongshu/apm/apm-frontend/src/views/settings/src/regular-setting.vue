<style lang="scss" scoped>
@import "~vars";
.setting-layout {
  &.content {
    padding-top: 0px;
  }
  position: static;
  display: flex;
  .tree-list {
    flex: 0.5;
    max-width: 30%;
    padding: $marginWidth;
    .el-tree {
      border: none;
    }
  }
  .config-table {
    flex: 1;
    width: 100%;
    border-left: 1px solid #dcdcdc;
    .config-item {
      border-bottom: 1px solid #dcdcdc;
      padding: $marginWidth;
      &:last-child {
        border-width: 0px;
      }
      li {
        padding: 10px;
      }
      p {
        font-size: 14px;
      }
      small {
        color: #999;
        font-size: 12px;
      }
      input[type="radio"] {
        margin-left: 10px;
      }
      .config-item-warning {
        color: #ff0000;
      }
    }
    .footer {
      text-align: center;
      padding: 10px;
    }
  }
}
</style>

<template>
<setting-container @onContainerLoaded="onContainerLoaded">
  <div class="setting-layout"  ref="loadingContainer">
    <div class="tree-list">
      <el-tree
        class="apm-tree-1"
        ref="applicationNodeTree"
        node-key="id"
        :highlight-current="true"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :data="nodes"
        :render-content="renderTreeContent"
        @node-click="onTreeNodeClick">
      </el-tree>
    </div>
    <div class="config-table">
      <template v-if="currentConfig.type==='application'">
        <ul class="config-item">
          <li><p>Apdex-T值设置</p><small>用户满意的目标时间，即用户不受应用响应时间妨碍的时间段</small></li>
          <li><el-input
              :disabled="+currentConfig.apdexTType===1"
              v-model="currentConfig.apdexT.value"
              size="mini"
              style="width: 150px;"
              @change="v=>{formItemValidate('apdexT')}"
              ></el-input>&nbsp;ms
              <transition>
              <span class="config-item-warning" v-show="!!currentConfig.apdexT.warning.length">{{currentConfig.apdexT.warning}}</span>
            </transition></li>
        </ul>
        <ul class="config-item" v-show="currentConfig.type==='application'">
          <li>
            <el-checkbox v-model="currentConfig.excludeErrorResponse">
              平均响应时间剔除错误响应
            </el-checkbox>
          </li>
        </ul>
      </template>
      <template v-else-if="currentConfig.type === 'instance' || currentConfig.type === 'transaction'">
        <ul class="config-item">
          <li><p>Apdex-T值设置</p><small>用户满意的目标时间，即用户不受应用响应时间妨碍的时间段</small></li>
          <li><el-radio size="small" v-model="currentConfig.apdexTType" label="1">使用应用预设T值</el-radio></li>
          <li>
            <el-radio size="small" v-model="currentConfig.apdexTType" label="2">自定义T值&nbsp;</el-radio>
            <el-input
              :disabled="+currentConfig.apdexTType===1"
              v-model="currentConfig.apdexT.value"
              size="mini"
              style="width: 150px;"
              @change="v=>{formItemValidate('apdexT')}"
              ></el-input>&nbsp;ms
            <transition>
              <span class="config-item-warning" v-show="!!currentConfig.apdexT.warning">{{currentConfig.apdexT.warning}}</span>
            </transition>
          </li>
        </ul>
      </template>
      <div class="footer" v-show="!!currentConfig.id">
        <el-button type="primary" size="small" style="width: 100px;" :loading="saveConfigLoading" @click="saveConfig">确定</el-button>
      </div>
    </div>
  </div>
</setting-container>
</template>

<script>
import util from '_util'
import loadingMixin from '_components/mixin/loading.js'
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
  Notification,
  Radio,
  Tree,
  Checkbox
} from 'element-ui'
export default {
  name: 'regular-setting',
  mixins: [loadingMixin],
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-radio': Radio,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-switch': Switch,
    'el-tooltip': Tooltip,
    'el-tag': Tag,
    'el-tree': Tree,
    'el-checkbox': Checkbox,
    SettingContainer
  },
  data() {
    return {
      saveConfigLoading: false,
      configTableList: [],
      applicationId: '',
      application: {
        id: this.$root.eventBus.getCurSystem().id,
        name: this.$root.eventBus.getCurSystem().name
      },
      currentConfig: {
        id: '',
        type: '',
        apdexTType: '1',
        apdexT: {
          value: '',
          correct: true,
          warning: ''
        },
        excludeErrorResponse: true
      },
      nodes: [],
      validators: {
        apdexT: {
          required: true, // 必填字段，如果值为null或者''或者undefined时，验证会通过
          missingMessage: '请输入ApdexT值',
          invalidMessage: '请输入正确的ApdexT值，仅允许正整数',
          validType: 'positiveInteger'
        }
      },
      validateItems: ['apdexT']
    }
  },
  watch: {
    'currentConfig.apdexTType'(v) {
      if (v === '1') {
        this.currentConfig.apdexT.value = null
        this.currentConfig.apdexT.correct = true
        this.currentConfig.apdexT.warning = ''
        this.currentConfig.apdexT.enableValidate = false
      } else {
        this.currentConfig.apdexT.enableValidate = true
      }
    }
  },
  methods: {
    onContainerLoaded() {
      this.loading = true
      Promise.all([
        this.getApplicationConfig(),
        this.getInstanceList(),
        this.getTransactionList()
      ]).then(result => {
        this.initNodes(...result)
        this.loading = false
        this.$nextTick(() => {
          this.$refs.applicationNodeTree.$el.querySelector('.el-tree-node').click()// setCurrentKey(this.nodes[0].id)
        })
      })
    },
    getApplicationConfig() {
      let vm = this
      return vm.api
        .getApplicationForApdexT({
          data: {
            appId: this.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          if (res.code === 0) {
            return {
              id: res.data.appId,
              name: res.data.appName,
              apdexT: {
                value: res.data.apdexT,
                correct: true,
                warning: ''
              },
              excludeErrorResponse: res.data.excludeErrorResponse,
              type: 'application'
            }
          }
          return null
        })
    },
    getInstanceList() {
      let vm = this
      return vm.api
        .getInstanceListForApdexT({
          data: {
            appId: this.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          if (res.code === 0) {
            return res.data.map((ins, index) => ({
              id: ins.instanceId,
              name: ins.instanceName,
              apdexT: {
                value: ins.apdexT,
                correct: true,
                warning: '',
                enableValidate: ins.apdexT !== null // apdexT不等于null则启用验证
              },
              apdexTType: ins.apdexT === null ? '1' : '2',
              type: 'instance'
            }))
          }
          return null
        })
    },
    getTransactionList() {
      let vm = this
      return vm.api
        .getTransactionListForApdexT({
          data: {
            appId: this.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          if (res.code === 0) {
            return res.data.apdexForTransactions.map(transaction => ({
              id: transaction.transaction,
              name: transaction.transaction,
              apdexT: {
                value: transaction.apdexT,
                correct: true,
                warning: '',
                enableValidate: transaction.apdexT !== null // apdexT不等于null则启用验证
              },
              apdexTType: transaction.apdexT === null ? '1' : '2',
              type: 'transaction'
            }))
          }
          return null
        })
    },
    initNodes(applicationOrigin, instancesOrigin, transactionsOrigin) {
      let nodes = []
      let applicationNode = {
        id: applicationOrigin.id,
        label: applicationOrigin.name,
        type: 'application',
        origin: applicationOrigin,
        children: []
      }

      let instanceNodes = instancesOrigin.map(instance => ({
        id: instance.id,
        label: instance.name,
        type: 'instance',
        origin: instance
      }))
      let transactionNodes = transactionsOrigin.map(transaction => ({
        id: transaction.id,
        label: transaction.name,
        type: 'transaction',
        origin: transaction
      }))
      let instanceRootNode = {
        id: 'instanceRootNode',
        label: `实例(${instanceNodes.length})`,
        type: '',
        children: instanceNodes
      }
      let transactionRootNode = {
        id: 'transactionRootNode',
        label: `事务(${transactionNodes.length})`,
        type: '',
        children: transactionNodes
      }
      applicationNode.children = [instanceRootNode, transactionRootNode]
      nodes.push(applicationNode)
      this.nodes = nodes
    },
    onTreeNodeClick(target, node, component) {
      if (!node.data.type) return
      this.currentConfig = node.data.origin
    },
    saveConfig() {
      let vm = this
      if (vm.saveConfigLoading) return
      let fetch = null
      let condition = null
      if (vm.validateAllConfig()) {
        switch (vm.currentConfig.type) {
          case 'application':
            fetch = vm.api.updateApdexTForApp
            condition = {
              appId: vm.currentConfig.id,
              apdexT: vm.currentConfig.apdexT.value,
              excludeErrorResponse: vm.currentConfig.excludeErrorResponse
            }
            break
          case 'instance':
            fetch = vm.api.updateApdexTForInstance
            condition = {
              instanceId: vm.currentConfig.id,
              apdexT: vm.currentConfig.apdexT.value
            }
            break
          case 'transaction':
            fetch = vm.api.updateApdexTForTransaction
            condition = {
              appId: vm.application.id,
              apdexForTransactions: [
                {
                  transaction: vm.currentConfig.id,
                  apdexT: vm.currentConfig.apdexT.value
                }
              ]
            }
            break
        }
        vm.saveConfigLoading = true
        fetch({ data: condition })
          .then(res => {
            if (res.code === 0) {
              Notification({
                title: '配置已保存',
                type: 'success'
              })
            } else {
              Notification({
                title: '配置保存失败',
                type: 'error'
              })
            }
          })
          .always(() => {
            vm.saveConfigLoading = false
          })
      }
    },
    /**
     * 验证规则：从currentConfig中取出值，结合validators中的验证规则进行验证。
     * 验证完成后最终会对当前currentConfig[itemKey]的correct和warning信息进行赋值
     */
    formItemValidate(itemKey) {
      let vm = this
      let Validator = util.Validator
      if (!vm.currentConfig[itemKey].enableValidate) { return true }
      let result = new Validator(
        vm.currentConfig[itemKey].value,
        vm.validators[itemKey]
      ).validate().result
      vm.currentConfig[itemKey].correct = result.valid
      vm.currentConfig[itemKey].warning = result.valid ? '' : result.message
      return result.valid
    },
    validateAllConfig() {
      let res = true
      for (let i = 0; i < this.validateItems.length; i++) {
        if (!this.formItemValidate(this.validateItems[i])) {
          res = false
        }
      }
      return res
    },
    renderTreeContent(h, { node, data, store }) {
      return h(
        'span',
        {
          attrs: {
            class: 'el-tree-node__label',
            title: node.label
          }
        },
        [
          node.label
        ])
    }
  }
}
</script>
