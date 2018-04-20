// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import apiServer from './helpers/apiServer'

import { echarts } from '_echarts'
import chartTheme from './assets/echarts/echarts-theme.json'
echarts.registerTheme('adminUi', chartTheme)
window.echarts = echarts

// common style classes collection
import './style/common.css'

Vue.config.productionTip = false
Vue.prototype.api = apiServer

// Admin Ui
import AdminUi from 'admin-ui' // 开发阶段
import 'admin-ui/style.css'

AdminUi.theme({
  colors: {
    'primary-1': '#04253e',
    'primary-2': '#4da6e6',
    'primary-3': '#5ab1ef',
    'primary-4': '#6bbdf7',
    'primary-5': '#cfebff',

    'info-1': '#221144',
    'info-2': '#a893d2',
    'info-3': '#b6a2de',
    'info-4': '#c6b5e9',
    'info-5': '#ece3ff',

    'warning-1': '#381e09',
    'warning-2': '#f6ad71',
    'warning-3': '#ffb980',
    'warning-4': '#ffca9e',
    'warning-5': '#ffe9d7',

    'danger-1': '#401014',
    'danger-2': '#cc6d73',
    'danger-3': '#d87a80',
    'danger-4': '#e2898f',
    'danger-5': '#ffcacd',

    'success-1': '#073031',
    'success-2': '#25bcbe',
    'success-3': '#2ec7c9',
    'success-4': '#39d2d4',
    'success-5': '#b8feff'
  }
})

Vue.use(AdminUi)

/* eslint-disable no-new */
// Router
Vue.use(VueRouter)
let router = new VueRouter({ routes })

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
