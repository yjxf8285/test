export default [{
  path: 'single-trans-snapshot',
  name: 'single-trans-snapshot',
  redirect: 'single-trans-snapshot/single-trans-overview',
  component: resolve => require(['../../views/application/src/single-trans-snapshot/index.vue'], resolve),
  children: [{
    path: 'single-trans-overview',
    name: 'single-trans-overview',
    component: resolve => require(['../../views/application/src/single-trans-snapshot/src/single-trans-overview.vue'], resolve)
  },
  {
    path: 'single-trans-waterfall',
    name: 'single-trans-waterfall',
    component: resolve => require(['../../views/application/src/single-trans-snapshot/src/single-trans-waterfall.vue'], resolve)
  },
  {
    path: 'single-trans-database',
    name: 'single-trans-database',
    component: resolve => require(['../../views/application/src/single-trans-snapshot/src/single-trans-database.vue'], resolve)
  },
  {
    path: 'single-trans-error-detail',
    name: 'single-trans-error-detail',
    component: resolve => require(['../../views/application/src/single-trans-snapshot/src/single-trans-error-detail.vue'], resolve)
  }
  ]
},
{
  path: 'single-component-snapshot',
  name: 'single-component-snapshot',
  redirect: 'single-component-snapshot/single-component-overview',
  component: resolve => require(['../../views/application/src/single-component-snapshot/index.vue'], resolve),
  children: [{
    path: 'single-component-overview',
    name: 'single-component-overview',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-overview.vue'], resolve)
  },
  {
    path: 'single-component-detail',
    name: 'single-component-detail',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-detail.vue'], resolve)
  },
  {
    path: 'single-component-stacktrace',
    name: 'single-component-stacktrace',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-stacktrace.vue'], resolve)
  },
  {
    path: 'single-component-error-detail',
    name: 'single-component-error-detail',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-error-detail.vue'], resolve)
  },
  {
    path: 'single-component-database',
    name: 'single-component-database',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-database.vue'], resolve)
  },
  {
    path: 'single-component-remote',
    name: 'single-component-remote',
    component: resolve => require(['../../views/application/src/single-component-snapshot/src/single-component-remote.vue'], resolve)
  }
  ]
}
]
