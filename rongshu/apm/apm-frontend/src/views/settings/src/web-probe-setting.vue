<style lang="scss" scoped>
@import "~vars";
.setting-layout {
  padding: 10px;
  .empty-panel {
    width: 100%;
    height: 500px;
    border: none;
    position: relative;
    .btn-enable-web-browser-agent {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -15px;
      margin-left: -100px;
      width: 200px;
    }
  }
  .browser-config-panel {
    padding: 10px;
  }
  .footer {
    text-align: center;
  }

  .warning {
    color: #ff0000;
  }
  .web-agent-download-info{
    li {
      padding: 10px;
    }
  }
}
</style>

<template>
<setting-container @onContainerLoaded="onContainerLoaded">
  <div class="setting-layout">
    <div class="config-table" ref="loadingContainer">
      <div v-show="!webProbeEnabled && loaded" class="empty-panel">
          <el-button class="btn-enable-web-browser-agent" type="primary" size="small" :loading="openWebProbeLoading" @click="openWebProbe">开启Web探针</el-button>
        </div>
      <div v-show="webProbeEnabled && loaded">
          <el-form class="browser-config-panel">
            <el-form-item label-width="190px"label="获取Web探针:">
              <el-button size="small" style="width: 100px;" @click="getWebAgentFile">点击下载</el-button>
            </el-form-item>
            <el-form-item
              v-for="(config, index) in browserConfig"
              :key="index"
              :label="config.configurationName + ':'"
              label-width="190px">
              <el-switch
                v-if="config.configurationValue === 'true' || config.configurationValue === 'false'"
                v-model="config.configurationValue"
                active-value="true"
                inactive-value="false"></el-switch>
              <el-input
                v-if="!(config.configurationValue === 'true' || config.configurationValue === 'false')"
                v-model="config.configurationValue"
                @change="validateConfigItem(config.configurationKey)"
                size="small"
                style="width: 200px;"></el-input>
              <p class="warning" v-show="!config.correct">{{config.warning}}</p>
              <p class="description" v-show="config.correct"></p>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button type="primary" size="small" style="width: 100px;" :loading="saveConfigLoading" @click="confirmConfig">确定</el-button>
          </div>
        </div>
    </div>
    <el-dialog
      title="获取Web探针"
      :visible.sync="webAgentDownloadDialogVisible"
      size="tiny">
      <ul class="web-agent-download-info">
        <li>将下述脚本植入要监测的系统内：</li>
        <li>{{webAgentDownloadContent}}</li>
        <li>注：请将此代码埋入header内</li>
      </ul>
    </el-dialog>
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
  name: 'web-probe-setting',
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
      openWebProbeLoading: false,
      webAgentDownloadDialogVisible: false,
      webAgentDownloadContent: '',
      browserConfigForm: {},
      browserConfig: [],
      webProbeEnabled: false,
      loaded: false,
      validators: {
        'kepler.browser.transFrequency': {
          required: true,
          missingMessage: '请输入探针数据发送频率',
          invalidMessage: '请输入正确的发送频率，仅允许正整数',
          validType: 'positiveInteger'
        }
      }
    }
  },
  created() {},
  mounted() {

  },
  methods: {
    onContainerLoaded() {
      this.getWebProbeEnabled()
    },
    getWebProbeEnabled() {
      this.api
        .getWebBrowserAgent({
          data: {
            appId: this.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          this.webProbeEnabled = res.data
          if (this.webProbeEnabled) {
            this.getWebAgentConfig()
          } else {
            this.$nextTick(() => {
              this.loaded = true
            })
          }
        })
    },
    getWebAgentConfig() {
      this.api
        .listWebAgentConfiguration({
          data: {
            appId: this.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          res.data.forEach(item => {
            item.correct = true
            item.warning = ''
            item.validator = this.validators[item.configurationKey]
            this.browserConfigForm[item.configurationKey] = item
            this.$nextTick(() => {
              this.loaded = true
            })
          })
          this.browserConfig = res.data
        })
    },
    // 开启Web探针，创建Web探针
    openWebProbe() {
      let vm = this
      vm.openWebProbeLoading = true
      vm.api
        .createWebAgent({
          data: {
            appId: vm.$root.eventBus.getCurSystem().id
          }
        })
        .then(res => {
          if (res.code === 0) {
            vm.webProbeEnabled = true
            vm.getWebAgentConfig()
            Notification({
              title: 'Web探针已开启',
              type: 'success'
            })
          } else {
            Notification({
              title: 'Web探针开启失败',
              type: 'error'
            })
          }
        })
        .always(() => {
          vm.openWebProbeLoading = false
        })
    },
    confirmConfig() {
      let vm = this
      if (vm.validateAllConfig()) {
        let configurations = vm.browserConfig.map(item => {
          let newItem = _.cloneDeep(item)
          delete newItem.validator
          delete newItem.correct
          delete newItem.warning
          return newItem
        })
        // 验证通过
        vm.api.updateWebAgentConfiguration({
          data: {
            appId: this.$root.eventBus.getCurSystem().id,
            configurations: configurations
          },
          beforeSend() {
            vm.saveConfigLoading = true
          },
          complete() {
            vm.saveConfigLoading = false
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
    validateConfigItem(itemKey, form) {
      form = form || this.browserConfigForm
      let Validator = util.Validator
      let result = new Validator(
        form[itemKey].configurationValue,
        form[itemKey].validator
      ).validate().result
      form[itemKey].correct = result.valid
      form[itemKey].warning = result.valid ? '' : result.message
      return result.valid
    },
    validateAllConfig() {
      let res = true
      for (let key in this.browserConfigForm) {
        if (
          this.browserConfigForm[key].validator &&
          !this.validateConfigItem(key, this.browserConfigForm)
        ) {
          res = false
        }
      }
      return res
    },
    // 获取Web探针文件
    getWebAgentFile() {
      this.api.listWebAgentConfigurationByAppId({
        data: {
          appId: this.$root.eventBus.getCurSystem().id
        }
      }).then(res => {
        let host = ''
        let port = ''
        let agentId = this.browserConfigForm['kepler.browser.showlog'].agentId
        res.data.forEach(item => {
          if (item.configurationKey === 'kepler.agent.collector.host') {
            host = item.configurationValue
          }
          if (item.configurationKey === 'kepler.agent.collector.port') {
            port = item.configurationValue
          }
        })
        return this.api
        .getWebAgentFile({
          data: {
            appId: this.$root.eventBus.getCurSystem().id,
            appName: agentId,
            host: host,
            port: port,
            agentId: agentId,
            showlog: this.browserConfigForm['kepler.browser.showlog'].configurationValue,
            openTracing: this.browserConfigForm['kepler.browser.openTraceEnabled'].configurationValue,
            transFrequency: this.browserConfigForm['kepler.browser.transFrequency'].configurationValue
          }
        })
      })
      .then(res => {
        this.webAgentDownloadDialogVisible = true
        let origin = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
        let appName = this.browserConfigForm['kepler.browser.showlog'].agentId
          /* eslint-disable no-useless-escape */
        this.webAgentDownloadContent = `<script src="${origin}\/js-sdks\/${appName}.js"><\/script>`
      })
    }
  }
}
</script>
