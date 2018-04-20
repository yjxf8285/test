<style lang="scss" scoped>
@import "~vars";
.application-list {
  height: 100%;
  width: 100%;
}
.app-name {
  text-decoration: none;
}
.empty-tips {
  td {
    text-align: center;
  }
}
.page-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  .operation-bar {
    height: 40px;
    padding: 0 20px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    h3, .add-btn, .tool-bar {
      vertical-align: middle;
    }
    h3 {
      float: left;
      display: inline-block;
      margin-right: 10px;
      height: 39px;
      line-height: 39px;
    }
    .toolbar {
      overflow-x: auto;
      vertical-align: middle;
      height: 39px;
      line-height: 35px;
      text-align: right;
    }
    .tool {
      vertical-align: middle;
      margin-left: 5px;
    }
  }
  .app-list-table-container {
    position: absolute;
    top: 47px;
    bottom: 0;
    width: 100%;
    padding: 20px;
  }
}
.form-item-grid {
  padding: 0 10px 10px 10px;
}
.app-name-input-container {
  height: 90px
}
.form-input {
  width: 100%;
}
</style>
<template>
  <div class="application-list au-theme-border-color--base-8">
    <div class="page-wrap au-theme-font-color--base-3">
      <div class="operation-bar clear au-theme-border-color--base-8">
        <h3>
          APP列表
        </h3>
        <div class="toolbar">
          <au-button class="add-btn" type="success" size="small" @click="addModalDisplay = true"><au-icon type="plus"/></au-button>
          <au-input class="tool" size="small" v-model="searchKey" icon="search"></au-input>
          <au-button class="tool" size="small" plain @click="getList" :loading="!!loading"><au-icon type="refresh" class="refresh-btn"></au-icon></au-button>
          <timepicker class="tool" size="small"/>
        </div>
      </div>
      <au-scroller class="app-list-table-container">
        <div ref="tableContainer">
          <au-table>
            <thead>
              <tr>
                <th>#</th>
                <th>App名称</th>
                <th>平均响应时间(ms)</th>
                <th>吞吐率(rpm)</th>
                <th>HTTP错误率(%)</th>
                <th>网络失败率(%)</th>
                <th>活跃用户数(人)</th>
                <th>活跃版本数</th>
                <th>最近接收数据时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in apps" :key="app.appId">
                <td><au-icon :type="app.mobileType == 5 ? 'apple' : (app.appmobileType == 6 ? 'android' : 'minus')"/></td>
                <td><router-link class="app-name au-theme-hover-font-color--primary-3" :to="{ name: 'application', params: { id: app.appId }}">{{app.appName}}</router-link></td>
                <td>{{ app.avgResponseTime || '--' }}</td>
                <td>{{ app.throughput || '--' }}</td>
                <td>{{ app.httpErrorRate || '--' }}</td>
                <td>{{ app.netWorkFailRate || '--' }}</td>
                <td>{{ app.activeUsers || '--' }}</td>
                <td>{{ app.activeVersion || '--' }}</td>
                <td>{{ app.lastReceiveDataTime ? formatDate(app.lastReceiveDataTime + '') : '--'}}</td>
              </tr>
              <tr v-show="!apps.length" class="empty-tips">
                <td colspan="9">暂无数据</td>
              </tr>
            </tbody>
          </au-table>
        </div>
      </au-scroller>
    </div>
    <au-modal
      title="添加APP"
      :display="addModalDisplay"
      @hide="addModalDisplay = false"
      on-enter="保存"
      width="36%"
      height="295px"
      :buttons="addModalButtons">
      <div class="form-item-grid app-name-input-container">
        <au-input class="form-input"ref="appNameInput" label="APP名称" v-model="appName" :validators="appNameValidators"/>
      </div>
      <div class="form-item-grid">
        <au-radio label="APP类型" v-model="mobileType" :radios="[
          {
            text: 'iOS',
            value: 5
          },
          {
            text: 'Android',
            value: 6
          }
        ]"/>
      </div>
    </au-modal>
  </div>
</template>
<script>
import Timepicker from '../../_commons/timepicker'
import store from '_store'
import { isEmptyString, formatDate } from '_utils'

export default {
  name: 'application-list',
  components: { Timepicker },
  data () {
    return {
      searchKey: '',
      originApps: [],
      loading: null,
      createLoading: null,
      addModalDisplay: false,
      appName: '',
      appNameValidators: [
        {
          validator (v) { return !isEmptyString(v) },
          warning: '请填写APP名称'
        },
        {
          validator (v) {
            // 使用字母数字和中文，最长32个字符
            let reg = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/g
            return reg.test(v) && v.length <= 32
          },
          warning: '请使用字母数字和中文，最长32个字符'
        }
      ],
      mobileType: 5,
      appKey: '',
      appKeyValidators: [
        {
          validator (v) { return !isEmptyString(v) },
          warning: '必须先生成APP Key'
        }
      ]
    }
  },
  mounted () {
    // this.getList()
    store.$on('currentIntervalChange', this.getList)
  },
  beforeDestroy () {
    store.$off('currentIntervalChange', this.getList)
  },
  computed: {
    addModalButtons () {
      let vm = this
      return [
        {
          text: '取消',
          plain: true,
          type: 'default',
          handler () {
            vm.addModalDisplay = false
          }
        },
        {
          text: '创建',
          type: 'primary',
          handler () {
            vm.$refs.appNameInput.validate().then(res => {
              if (res) { // 校验通过
                vm.createApp().then(res => {
                  vm.createLoading.close()
                  if (res && res.data && res.data.agentToken) {
                    vm.$alert({
                      message: `创建成功!APP KEY:${res.data.agentToken}`
                    })
                    vm.appName = ''
                    vm.addModalDisplay = false
                  } else {
                    vm.$toast({
                      message: '创建失败',
                      icon: 'frown-o',
                      iconClass: 'au-theme-font-color--danger-3'
                    })
                  }
                })
              }
            })
          }
        }
      ]
    },
    apps () {
      return this.originApps.filter((app) => {
        return app.appName.indexOf(this.searchKey) !== -1
      })
    }
  },
  methods: {
    getList (v) {
      let vm = this
      vm.loading = vm.$loading({
        target: vm.$refs.tableContainer
      })
      return vm.api.getAppList({
        data: {
          condition: store.getCurrentTimeSpan()
        }
      }).then(res => {
        if (res && res.data) {
          vm.originApps = res.data.sort((a, b) => { // 按平均响应时间排序
            return (b.avgResponseTime || 0) - (a.avgResponseTime || 0)
          })
        } else {
          vm.originApps = []
        }
        vm.loading.close()
        vm.loading = null
        store.setApplicationList(vm.originApps)
      })
    },
    formatDate,
    createApp () {
      let vm = this
      vm.createLoading = vm.$loading()
      return vm.api.createApp({
        data: {
          condition: {
            appName: vm.appName,
            mobileType: vm.mobileType
          }
        }
      })
    }
  }
}
</script>

