<style lang="scss" scoped>
  @import '~vars';
  .application-selector {
    cursor: pointer;
    .current-app {
      font-size: $normal;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      .app-name {
        float: left;
        width: 100%;
        height: 39px;
        padding: 11px 20px 0 20px;
        & > span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          max-width: 200px;
        }
      }
      .pop-icon {
        float: right;
      }
    }
    .app-list-container {
      z-index: 99;
      position: absolute;
      left: -5px !important;
      // overflow-y: auto;
      width: 260px;
      // max-height: 500px;
      padding: 10px 20px;
      border-width: 1px;
      border-style: solid;
      border-radius: 0;
      .app-search {
        width: 100%;
      }
      li {
        padding: 5px;
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
  }
</style>
<template>
  <div class="application-selector au-theme-font-color--base-3">
    <popper ref="mypopper" trigger="click" :visible-arrow="false" :options="{placement: 'left bottom'}">
      <div class="popper app-list-container au-theme-border-color--base-8 au-theme-shadow--level-3 au-theme-background-color--base-11">
        <au-input
          class="app-search"
          v-model.trim="keyword"
          placeholder="搜索"
          icon="icon ion-search"
          icon-position="right"/>
        <au-scroller class="app-list-scroller">
          <ul class="app-list">
            <li
              class="
                au-theme-hover-background-color--base-10
                au-theme-hover-font-color--primary-3
              "
              v-for="(app, index) in apps"
              :class="{
                'au-theme-font-color--primary-3': app.id === curApp.id
              }"
              :style="{
                cursor: app.id === curApp.id ? 'auto' : 'pointer'
              }"
              @click="seclectApp(app)"
              :key="index">{{app.name}}</li>
          </ul>
        </au-scroller>
      </div>
      <div class="
        current-app clear
        au-theme-border-color--base-8
        au-theme-hover-background-color--base-10
        au-theme-hover-font-color--primary-3" slot="reference" ref="currentApp">
        <div class="app-name" :style="{textAlign: collapse ? 'center' : 'left'}">
          <span v-show="!collapse">{{curApp ? (curApp.name || '请选择应用') : '请选择应用'}}</span>
          <au-icon class="pop-icon" :style="{float: collapse ? 'none' : 'right'}" type="chevron-down"></au-icon>
        </div>
      </div>
    </popper>
  </div>
</template>

<script>
  import Popper from 'vue-popperjs'
  import 'vue-popperjs/dist/css/vue-popper.css'
  import store from '_store'

  export default {
    components: {
      'popper': Popper
    },
    mounted () {
      let oldList = store.getApplicationList()
      if (!oldList || (oldList && (new Date()).getTime() - oldList._timestamp < 60000)) {
        this.getAppList().then(this.getCurrApp)
      } else {
        this.getCurrApp()
      }
    },
    props: {
      collapse: false
    },
    data () {
      return {
        keyword: '',
        curApp: {},
        apps: store.getApplicationList(),
        loading: null
      }
    },
    watch: {
      keyword () {
        this.filterApps()
      },
      curApp: {
        deep: true,
        handler (v = {}) {
          this.$router.push({
            params: {
              appId: v.id
            }
          })
        }
      }
    },
    methods: {
      getAppList () {
        let vm = this
        vm.loading = this.$loading({
          target: vm.$refs.currentApp
        })
        return vm.api.getAppList({
          params: {
            mock: true
          }
        }).then(res => {
          store.setApplicationList(res.data)
          vm.apps = res.data
          vm.loading.close()
        })
      },
      getCurrApp () {
        let allApplications = store.getApplicationList()
        for (let i = 0; i < allApplications.length; i++) {
          if (String(allApplications[i].id) === String(this.$route.params.appId)) {
            this.curApp = allApplications[i]
            store.setCurrentApplication(allApplications[i])
            break
          }
        }
        if (!this.curApp.id) {
          this.curApp = allApplications[0]
          store.setCurrentApplication(allApplications[0])
        }
      },
      filterApps () {
        let res = []
        let allApplications = store.getApplicationList()
        if (this.keyword) {
          allApplications.forEach(app => {
            if (app.name.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1) {
              res.push(app)
            }
          })
          this.apps = res
        } else {
          this.apps = allApplications
        }
      },
      seclectApp (v) {
        if (v.id === this.curApp.id) return
        this.curApp = v
        this.$refs.mypopper.doClose()
        store.setCurrentApplication(v)
      }
    }
  }
</script>

