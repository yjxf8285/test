import {
  remove,
  find
} from 'lodash'

let firstCount = 0
let appList = []

export default {
  data: {
    instancesInTiers: [],
    snapshot: {
      selectedTabName: null,
      tabs: []
    }
  },
  // vue instance config
  methods: {
    // 刷新系统选择器的方法,此方法在系统下拉组件中注册，其他模块可以调用次方法来刷新系统下拉菜单
    refreshSystemSelector() {},
    // 由于每次取值时要求是最新的sessionStorage值，所以不能使用计算属性（它有缓存，不会及时更新）
    setAppList(list) {
      appList = list
    },
    getCurSystem() {
      let curSystemId = window.sessionStorage.getItem('curSystemId')
      if (curSystemId && appList && appList.length > 0) {
        return {
          id: curSystemId,
          name: window.sessionStorage.getItem('curSystemName')
        }
      } else {
        return {
          id: null,
          name: ''
        }
      }
    },
    setCurSystem(value) {
      window.sessionStorage.setItem('curSystemId', value.id)
      window.sessionStorage.setItem('curSystemName', value.name)
      firstCount++
      if (firstCount > 1) {
        this.$emit('system-or-time-change', {
          curSystem: this.getCurSystem(),
          curTime: this.getCurTime()
        })
      }
      this.$emit('system-change', {
        curSystem: this.getCurSystem(),
        curTime: this.getCurTime()
      })
    },
    getCurTime() {
      return {
        startTime: window.sessionStorage.getItem('startTime'),
        endTime: window.sessionStorage.getItem('endTime')
      }
    },
    setCurTime(value) {
      let startTime = value[0]
      let endTime = value[1]
      window.sessionStorage.setItem('startTime', startTime)
      window.sessionStorage.setItem('endTime', endTime)
      firstCount++
      if (firstCount >= 1) {
        this.$emit('system-or-time-change', {
          curSystem: this.getCurSystem(),
          curTime: this.getCurTime()
        })
      }

      this.$emit('time-change', {
        curSystem: this.getCurSystem(),
        curTime: this.getCurTime()
      })
    },
    setAutoRefresh(value) {
      window.sessionStorage.setItem('autoRefresh', value ? 1 : 0)
    },
    getAutoRefresh() {
      return !!Number(window.sessionStorage.getItem('autoRefresh'))
    },
    isTransTab(route) {
      return route.name === 'single-trans-overview' ||
        route.name === 'single-trans-waterfall' ||
        route.name === 'single-trans-error-detail' ||
        route.name === 'single-trans-database'
    },
    isComponentTab(route) {
      return route.name === 'single-component-overview' ||
        route.name === 'single-component-detail' ||
        route.name === 'single-component-database' ||
        route.name === 'single-component-error-detail' ||
        route.name === 'single-component-remote' ||
        route.name === 'single-component-stacktrace'
    },
    /**
     * 切换Tab
     * 如果是新的，则保存一个新的
     * 如果不是新的则找到并指定为selectedTab
     *
     * @param {any} tab
     */
    openTab(tab) {
      tab.type = tab.type || 'single-trans-snapshot'
      let curTab = find(this.snapshot.tabs, r => {
        return r.name === tab.name
      })
      if (!curTab) {
        this.snapshot.tabs.push(tab)
      }
      this.snapshot.selectedTabName = tab.name
      this.$emit('snapshot-tab-change', this.snapshot.tabs, this.snapshot.selectedTabName)
    },
    /**
     * 1.删除Tab对应的路由项
     * 2.更新选中的Tab
     *
     * @param {any} tabName
     */
    closeTab(tabName) {
      let vm = this
      let removedIndex = 0
      let selectedTabRemoved = false
      remove(vm.snapshot.tabs, (r, index) => {
        let same = r.name === tabName
        if (same) {
          selectedTabRemoved = tabName === vm.snapshot.selectedTabName
          removedIndex = index
        }
        return same
      })
      if (selectedTabRemoved) {
        let tab = vm.snapshot.tabs[removedIndex] || vm.snapshot.tabs[vm.snapshot.tabs.length - 1] || null

        vm.snapshot.selectedTabName = tab ? tab.name : null
      }
      this.$emit('snapshot-tab-change', this.snapshot.tabs, this.snapshot.selectedTabName)
    },
    closeAllTabs() {
      this.snapshot.tabs = []
    },
    switchTab(tabName) {
      this.snapshot.selectedTabName = tabName
    },
    addLazyloadComponent(component) {
      this.$emit('add-lazyload-component', component)
    }
  }
}
