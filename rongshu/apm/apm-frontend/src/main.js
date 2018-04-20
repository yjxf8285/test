import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

// import App from './views/login/index.vue'
import App from './App'
// import store from './vuex/store'

// ajax-config
import store from './store.js'
import ajaxManager from './ajax-manager'

// api models

import appModels from './models/application'
import oldapiModel from './models/oldapi'
import tpModel from './models/tp'
import loginModel from './models/login'

import settingsModels from './models/settings.js'

// ui components
import {
  Loading
} from 'element-ui'
import './assets/css/element-variables.scss'
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.use(Router)

// 全局组件
const globalComponents = [
  require('./components/layout/top-bar.vue'),
  require('./components/filter-bar/filter-bar-complex.vue')
]

globalComponents.map(m => {
  Vue.component(m.name, m)
})

Vue.config.productionTip = false

let router = new Router({
  routes
})
// 导航跳转等待动画
// let routerLoadingInstance = null
/* router.beforeEach((to, from, next) => {
 routerLoadingInstance = Loading.service();
 next()
 });
 router.afterEach(route => {
 if(routerLoadingInstance){
 routerLoadingInstance.close();
 }
 //$('.el-loading-mask').remove()
 }); */

import AdminUi from 'admin-ui/dist'
import 'admin-ui/dist/style.css'
Vue.use(AdminUi)

Object.defineProperty(
  Vue.prototype,
  'api', {
    value: ajaxManager([
      ...appModels,
      oldapiModel,
      tpModel,
      settingsModels,
      loginModel
    ], {
      // any global config
      /* eslint-disable */
      __apiRoot: '/api', //透传方式
      // __apiRoot: 'http://10.200.10.22:28080',//直连方式
      method: 'post',
      // data: {
      //   ver: '0.1'
      // },
      contentType: 'application/json',

      dataType: 'json',
      error(xhr, textStatus, err) {
        // Message({
        //   message: '请求失败，请稍后重试',
        //   type: 'error'
        // })
      },
      success(res) {
        if (
          (400 <= res.statusCode && 500 > res.statusCode) ||
          (500 <= res.statusCode && 600 > res.statusCode) ||
          !res.success
        ) {
          // console.error('请求失败:',res) //这里会执行多次，貌似这个api方法写的有坑，以后得重写
          // Message({
          //   message: '请求失败，请稍后重试',
          //   type: 'error'
          // })
        }
        if (!res.success && res.code === 'M9000') {
          app.$router.push({
            name: 'login',
            query: {
              redirectUrl: encodeURIComponent(window.location.href)
            }
          })
        }
      }
      /* eslint-enable */
    }, $)
  }
)

const eventBus = new Vue(store)
const app = new Vue({
  // store,
  router,
  template: '<App/>',
  components: {
    App
  },
  data: {
    eventBus
  }
}).$mount('#app')
console.log('v4.0.2')
