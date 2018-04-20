/**
 * Created by liuxiaofan on 2017/4/12.
 */
import application from './config/application'
import singleTransSnapshot from './config/single-trans-snapshot'

let mainRoutes = [].concat(application)

var routes = [{
  path: '/',
  redirect: '/wide/app-overview',
  component: resolve => require(['../views/home.vue'], resolve),
  children: mainRoutes
},
{
  path: '/login',
  name: 'login',
  component: resolve => require(['../views/login/index.vue'], resolve)
},
{
  path: '/wide', // 注意只有没有左边菜单的页面才走这个路由
  component: resolve => require(['../views/wide.vue'], resolve),
  children: [{
    path: '',
    redirect: 'app-overview'
  },
  {
    path: 'app-overview',
    name: 'app-overview',
    component: resolve => require(['../views/application/src/app-overview/index.vue'], resolve)
  }
  ]
},
{
  path: '/snapshot',
  name: 'snapshot',
  redirect: {
    name: 'single-trans-snapshot'
  },
  component: resolve => require(['../views/snapshot.vue'], resolve),
  children: singleTransSnapshot
},
{
  path: '/404',
  name: '404',
  component: resolve => require(['../views/404.vue'], resolve)
},
{
  path: '*',
  redirect: {
    name: '404'
  }
}
]

export default routes
