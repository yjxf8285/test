export default [
  {
    path: '/',
    redirect: { name: 'application-list' },
    component: resolve => require(['../views'], resolve),
    children: [
      {
        path: 'application-list',
        name: 'application-list',
        component: resolve => require(['../views/application-list'], resolve)
      },
      {
        path: 'application/:id',
        name: 'application',
        component: resolve => require(['../views/application'], resolve),
        redirect: { name: 'dashboard' },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: resolve => require(['../views/dashboard'], resolve)
          },
          {
            path: 'network-request',
            name: 'network-request',
            component: resolve => require(['../views/network-request'], resolve)
          },
          {
            path: 'network-error',
            name: 'network-error',
            component: resolve => require(['../views/network-error'], resolve)
          },
          {
            path: 'interaction-analysis',
            name: 'interaction-analysis',
            component: resolve => require(['../views/interaction-analysis'], resolve)
          },
          {
            path: 'settings',
            name: 'settings',
            component: resolve => require(['../views/settings'], resolve)
          }
        ]
      }
    ]
  },
  {
    path: '/single-error-snapshoot',
    alias: '/application/:id/network-error/single-error-snapshoot',
    name: 'single-error-snapshoot',
    component: resolve => require(['../views/network-error/src/single-error-snapshoot.vue'], resolve)
  },
  {
    path: '/single-interaction-snapshoot',
    alias: '/application/:id/interaction-analysis/single-interaction-snapshoot',
    name: 'single-interaction-snapshoot',
    component: resolve => require(['../views/interaction-analysis/src/single-interaction-snapshoot.vue'], resolve)
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['../views/404.vue'], resolve)
  },
  {
    path: '*',
    redirect: {name: '404'}
  }
]
