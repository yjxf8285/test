export default [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'application-list' },
    component: resolve => require(['../pages/index.vue'], resolve),
    children: [
      {
        name: 'application-list',
        path: '/application-list',
        component: resolve => require(['../pages/application-list'], resolve),
        meta: {
          title: '应用列表'
        }
      },
      {
        name: 'application',
        path: '/application',
        component: resolve => require(['../pages/application'], resolve),
        redirect: { name: 'dashboard' },
        meta: {
          title: '当前应用'
        },
        children: [
          {
            name: 'dashboard',
            path: 'dashboard',
            component: resolve => require(['../pages/application/dashboard'], resolve),
            meta: {
              title: '仪表盘'
            }
          },
          {
            name: 'transaction',
            path: 'transaction',
            component: resolve => require(['../pages/application/transaction'], resolve),
            redirect: { name: 'transaction-list' },
            meta: {
              title: '事务'
            },
            children: [
              {
                name: 'transaction-list',
                path: 'list',
                component: resolve => require(['../pages/application/transaction/list'], resolve),
                meta: {
                  child: { name: 'transaction-detail' },
                  title: '列表'
                }
              },
              {
                name: 'transaction-detail',
                path: 'detail',
                component: resolve => require(['../pages/application/transaction/detail'], resolve),
                meta: {
                  title: '详情'
                }
              }
            ]
          },
          {
            name: 'database',
            path: 'database',
            component: resolve => require(['../pages/application/database'], resolve),
            meta: {
              title: '数据库'
            }
          },
          {
            name: 'remote',
            path: 'remote',
            component: resolve => require(['../pages/application/remote'], resolve),
            redirect: { name: 'remote-list' },
            meta: {
              title: '远程调用'
            },
            children: [
              {

                name: 'remote-list',
                path: 'list',
                component: resolve => require(['../pages/application/remote/list'], resolve),
                meta: {
                  child: { name: 'remote-detail' },
                  title: '列表'
                }
              },
              {
                name: 'remote-detail',
                path: 'detail',
                component: resolve => require(['../pages/application/remote/detail'], resolve),
                meta: {
                  title: '详情'
                }
              }
            ]
          },
          {
            name: 'error',
            path: 'error',
            component: resolve => require(['../pages/application/error'], resolve),
            redirect: { name: 'error-list' },
            meta: {
              title: '错误'
            },
            children: [
              {
                name: 'error-list',
                path: 'list',
                component: resolve => require(['../pages/application/error/list'], resolve),
                meta: {
                  child: { name: 'transaction-detail' },
                  title: '列表'
                }
              },
              {
                name: 'error-detail',
                path: 'detail',
                component: resolve => require(['../pages/application/error/detail'], resolve),
                meta: {
                  title: '详情'
                }
              }
            ]
          },
          {
            name: 'browser',
            path: 'browser',
            component: resolve => require(['../pages/application/browser'], resolve),
            meta: {
              title: '浏览器'
            }
          },
          {
            name: 'settings',
            path: 'settings',
            component: resolve => require(['../pages/application/settings/index.vue'], resolve),
            redirect: {
              name: 'tier-list-setting'
            },
            meta: {
              title: '设置'
            },
            children: [{
              title: 'Tier设置',
              path: 'tier-list-setting',
              name: 'tier-list-setting',
              component: resolve => require(['../pages/application/settings/src/tier-list-setting.vue'], resolve),
              meta: {
                title: 'Tier设置'
              }
            }]
          },
          {
            name: 'tier',
            path: 'tier',
            component: resolve => require(['../pages/application/tier'], resolve),
            redirect: { name: 'tier-list' },
            meta: {
              title: 'Tier'
            },
            children: [
              {
                name: 'tier-list',
                path: 'list',
                component: resolve => require(['../pages/application/tier/list'], resolve),
                meta: {
                  title: '列表'
                }
              },
              {
                name: 'tier-detail',
                path: 'detail',
                component: resolve => require(['../pages/application/tier/detail'], resolve),
                redirect: { name: 'tier-detail-dashboard' },
                meta: {
                  title: '详情'
                },
                children: [
                  {
                    name: 'tier-detail-dashboard',
                    path: 'dashboard',
                    component: resolve => require(['../pages/application/dashboard'], resolve),
                    meta: {
                      title: '仪表盘'
                    }
                  },
                  {
                    name: 'tier-detail-transaction',
                    path: 'transaction',
                    component: resolve => require(['../pages/application/transaction'], resolve),
                    redirect: { name: 'tier-detail-transaction-list' },
                    meta: {
                      title: '事务'
                    },
                    children: [
                      {
                        name: 'tier-detail-transaction-list',
                        path: 'list',
                        component: resolve => require(['../pages/application/transaction/list'], resolve),
                        meta: {
                          title: '列表',
                          child: { name: 'tier-detail-transaction-detail' }
                        }
                      },
                      {
                        name: 'tier-detail-transaction-detail',
                        path: 'detail',
                        component: resolve => require(['../pages/application/transaction/detail'], resolve),
                        meta: {
                          title: '详情'
                        }
                      }
                    ]
                  },
                  {
                    name: 'tier-detail-database',
                    path: 'database',
                    component: resolve => require(['../pages/application/database'], resolve),
                    meta: {
                      title: '数据库'
                    }
                  },
                  {
                    name: 'tier-detail-remote',
                    path: 'remote',
                    component: resolve => require(['../pages/application/remote'], resolve),
                    redirect: { name: 'tier-detail-remote-list' },
                    meta: {
                      title: '远程调用'
                    },
                    children: [
                      {
                        name: 'tier-detail-remote-list',
                        path: 'list',
                        component: resolve => require(['../pages/application/remote/list'], resolve),
                        meta: {
                          title: '列表',
                          child: { name: 'tier-detail-remote-detail' }
                        }
                      },
                      {
                        name: 'tier-detail-remote-detail',
                        path: 'detail',
                        component: resolve => require(['../pages/application/remote/detail'], resolve),
                        meta: {
                          title: '详情'
                        }
                      }
                    ]
                  },
                  {
                    name: 'tier-detail-error',
                    path: 'error',
                    component: resolve => require(['../pages/application/error'], resolve),
                    meta: {
                      title: '错误'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['../pages/404.vue'], resolve),
    meta: {
      title: '错误页'
    }
  },
  {
    path: '/demo',
    name: 'demo',
    redirect: {name: 'datagrid'},
    component: resolve => require(['../pages/demo.vue'], resolve),
    meta: {
      title: 'Demo页'
    },
    children: [
      {
        path: 'datagrid',
        name: 'datagrid',
        component: resolve => require(['../pages/demo/datagrid.vue'], resolve)
      },
      {
        path: 'charts',
        name: 'charts',
        component: resolve => require(['../pages/demo/chart.vue'], resolve)
      },
      {
        path: 'charts2',
        name: 'charts2',
        component: resolve => require(['../pages/demo/chart2.vue'], resolve)
      },
      {
        path: 'pie',
        name: 'pie',
        component: resolve => require(['../pages/demo/pie.vue'], resolve)
      },
      {
        path: 'topo',
        name: 'topo',
        component: resolve => require(['../pages/demo/topo.vue'], resolve)
      },
      {
        path: 'default-container',
        name: 'default-container',
        component: resolve => require(['../pages/demo/default-container.vue'], resolve)
      }
    ]
  },
  {
    path: '*',
    redirect: { name: '404' }
  }
]
