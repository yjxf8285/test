<style lang="scss" scoped>
  @import '~vars';
  .settings {
    padding: 20px;
    .form-container {
      width: 100%;
      font-size: $normal;
      td {
        vertical-align: middle;
        height: 42px;
      }
      td:first-child {
        width: 120px;
        padding-right: 10px;
        text-align: right;
      }
      td:last-child {
        padding-left: 10px;
      }
    }
    .seperate-line {
      border-bottom-style: solid;
      border-bottom-width: 1px;
      margin: 5px 0;
    }
    .help-icon {
      margin-left: 10px;
      font-size: $large;
      display: inline;
    }
  }
  .help-message {
    padding: 5px;
    font-size: $small;
  }
</style>
<template>
  <div class="settings au-theme-font-color--base-3">
    <table class="form-container au-theme-border-color--base-8">
      <tr>
        <td>APP名称：</td>
        <td><au-input v-model="appName" :validators="appNameValidators"/></td>
      </tr>
      <tr>
        <td>APP类型：</td>
        <td><au-radio v-model="appType" :radios="[
          {
            text: 'iOS',
            value: 'ios'
          },
          {
            text: 'Android',
            value: 'android'
          }
        ]"/></td>
      </tr>
      <tr>
        <td>APP Key：</td>
        <td>{{ appKey }}</td>
      </tr>
    </table>
    <div class="seperate-line au-theme-border-color--base-8"></div>
    <table class="form-container au-theme-border-color--base-8">
      <tr>
        <td>探针设置：</td>
        <td><au-checkbox style="display:inline;" v-model="enableAgentSetting" text="是否开启探针"/></td>
      </tr>
    </table>
    <div class="seperate-line au-theme-border-color--base-8"></div>
    <table class="form-container au-theme-border-color--base-8">
      <tr>
        <td>采集设置：</td>
        <td><au-checkbox style="display:inline;" v-model="collectionSetting" :disabled="!enableAgentSetting" :checkboxes="[
          {
            text: '网络事务采集',
            value: 1
          },
          {
            text: 'HTTP网络错误采集',
            value: 2
          },
          {
            text: '网络失败采集',
            value: 3
          }
        ]"/></td>
      </tr>
    </table>
    <div class="seperate-line au-theme-border-color--base-8"></div>
    <table class="form-container au-theme-border-color--base-8">
      <tr>
        <td>交互设置：</td>
        <td><au-checkbox style="display:inline;" v-model="enableInteractionSetting" :disabled="!enableAgentSetting" text="交互数据采集"/></td>
      </tr>
      <tr>
        <td>慢交互阈值：</td>
        <td>
          <au-input v-model="slowInteractionThreshold" :validators="appNameValidators" :disabled="!enableAgentSetting || !enableInteractionSetting" placeholder="ms，默认为500" type="number"/>
          <au-popover>
            <au-icon slot="target" type="question-circle" class="help-icon"/>
            <div slot="content" class="help-message">只采集大于阈值的交互行为，默认为500ms</div>
          </au-popover>
        </td>
      </tr>
      <tr>
        <td>最大条数设置：</td>
        <td>
          <au-input v-model="maxCount" :validators="appNameValidators" :disabled="!enableAgentSetting || !enableInteractionSetting" placeholder="条，默认为20" type="number"/>
          <au-popover>
            <au-icon slot="target" type="question-circle" class="help-icon"/>
            <div slot="content" class="help-message">每个数据发送周期采集的最大交互行为条数，默认为20条</div>
          </au-popover>
        </td>
      </tr>
    </table>
    <div class="seperate-line au-theme-border-color--base-8"></div>
    <table class="form-container au-theme-border-color--base-8">
      <tr>
        <td></td>
        <td><au-button class="save-btn" type="success">保存</au-button></td>
      </tr>
    </table>
  </div>
</template>
<script>
import { isEmptyString } from '_utils'

export default {
  name: 'settings',
  data () {
    return {
      appName: '',
      appNameValidators: [
        {
          validator (v) { return !isEmptyString(v) },
          warning: '请填写APP名称'
        },
        {
          validator (v) {
            // 使用字母数字和中文，最长32个字符
            let regRes = v.match(/([\u4E00-\u9FA5]+)|(\w+)/g)
            return (regRes ? regRes.join() : '') === v && v.length <= 32
          },
          warning: '请使用字母数字和中文，最长32个字符'
        }
      ],
      appType: 'ios',
      appKey: 'fa8fasfjfa8fjldskaj09afsf0f',
      enableAgentSetting: true,
      collectionSetting: [],
      enableInteractionSetting: false,
      slowInteractionThreshold: '',
      maxCount: ''
    }
  }
}
</script>


