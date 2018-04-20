<style lang="scss" scoped>
  .application-selector {
    cursor: pointer;
    .current-app {
      font-size: 14px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      height: 50px;
      .app-name {
        width: 100%;
        height: 100%;
        line-height: 50px;
        padding: 0 20px;
        & > span {
          display: inline-block;
          height: 100%;
          line-height: 50px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          max-width: 200px;
        }
      }
      .pop-icon {
        float: right;
        height: 100%;
        line-height: 50px;
      }
    }
  }
  .app-list-container {
    // width: 260px;
    // min-height: 100px;
    padding: 10px;
    // border-width: 1px;
    // border-style: solid;
    border-radius: 0;
    .app-search {
      width: 100%;
    }
    li {
      padding: 10px 5px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .app-list-scroller {
      margin-top: 10px;
      max-height: 400px;
    }
  }
</style>
<template>
  <div class="application-selector au-theme-font-color--base-3">
    <au-popover
      ref="mypopper"
      trigger="click"
      plain
      hide-on-blur
      y-fix="-11px"
      :triangle="false"
      placement="bottom center">
      <div
        class="
          current-app
          au-theme-border-color--base-8
          au-theme-hover-background-color--base-10
          au-theme-hover-font-color--primary-3"
        slot="target"
        ref="currentApp">
        <div
          class="app-name"
          :style="{textAlign: collapse ? 'center' : 'left'}">
          <span v-show="!collapse">{{ curApp ? (curApp.appName || '请选择应用') : '请选择应用' }}</span>
          <au-icon
            class="pop-icon"
            :style="{float: collapse ? 'none' : 'right'}"
            type="chevron-right"/>
        </div>
      </div>
      <div class="app-list-container" slot="content" ref="appListContainer">
        <au-input
          class="app-search"
          v-model.trim="keyword"
          placeholder="搜索"
          width="238px"
          icon="icon ion-search"
          icon-position="right"/>
        <au-scroller class="app-list-scroller">
          <ul class="app-list">
            <li
              class="
                au-theme-hover-background-color--base-10
                au-theme-hover-font-color--primary-3
              "
              v-for="app in apps"
              :class="{
                'au-theme-font-color--primary-3': app.system_config_id === curApp.system_config_id
              }"
              :style="{
                cursor: app.system_config_id === curApp.system_config_id ? 'auto' : 'pointer'
              }"
              @click="seclectApp(app)"
              :key="app.system_config_id">{{ app.appName }}</li>
          </ul>
        </au-scroller>
      </div>
    </au-popover>
  </div>
</template>

<script>
import common from '_common'
import store from '_store'

export default {
  mounted () {
    this.getAppList().then(this.getCurrApp)
    store.$on(common.storeEvents.selectedAppcationChanged, (v) => {
      console.log(common.storeEvents.selectedAppcationChanged)
      console.log(v)
    })
  },
  props: {
    collapse: false
  },
  data () {
    return {
      keyword: '',
      curApp: {},
      apps: [],
      loading: null
    }
  },
  watch: {
    keyword () {
      this.filterApps()
    }
  },
  methods: {
    getAppList () {
      let vm = this
      vm.loading = this.$loading({
        target: vm.$refs.currentApp,
        size: 35
      })
      return vm.api.getApplications().then(res => {
        vm.apps = res.data.map(item => {
          return {
            system_config_id: item.system_config_id,
            appName: item.system_config_name
          }
        })
        store.set(common.storeKeys.applicationList, vm.apps)
        vm.loading.close()
      })
    },
    getCurrApp () {
      let allApplications = store.get(common.storeKeys.applicationList)
      let lastCurrApp = store.get(common.storeKeys.selectedApplication)
      for (let i = 0; i < allApplications.length; i++) {
        if (lastCurrApp && String(allApplications[i].system_config_id) === String(lastCurrApp.system_config_id)) {
          this.curApp = allApplications[i]
          store.set(common.storeKeys.selectedApplication, allApplications[i])
          break
        }
      }
      if (!this.curApp.system_config_id) {
        this.curApp = allApplications[0]
        store.set(common.storeKeys.selectedApplication, allApplications[0])
      }
    },
    filterApps () {
      let res = []
      let allApplications = store.get(common.storeKeys.applicationList)
      if (this.keyword) {
        allApplications.forEach(app => {
          if (app.appName.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
            res.push(app)
          }
        })
        this.apps = res
      } else {
        this.apps = allApplications
      }
    },
    seclectApp (v) {
      if (v.system_config_id === this.curApp.system_config_id) return
      this.curApp = v
      store.set(common.storeKeys.selectedApplication, v)
      this.$refs.mypopper.hide()
    }
  }
}
</script>
