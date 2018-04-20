// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AdminUi from 'admin-ui/dist/index.js'
import 'admin-ui/dist/style.css' // 样式需要单独引入
import common from './common.js'
import store from '_store'
import api from './helpers/api-server'
Vue.use(AdminUi)

Object.defineProperty(
  Vue.prototype,
  'api', {
    value: api
  }
)
// 注册关联状态
store.addStatesGroup([
  common.storeKeys.applicationList,
  common.storeKeys.selectedApplication,
  common.storeKeys.selectedTimeRange
])

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
