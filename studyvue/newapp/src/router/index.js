import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: require('../views/home/index.vue')
    }, {
      path: '/data-access',
      name: '数据接入',
      component: function (resolve) {
        return require(['../views/data-access/index.vue'], resolve)
      }
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})

