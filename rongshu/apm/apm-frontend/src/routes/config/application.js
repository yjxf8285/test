export default [{
  path: 'application',
  name: 'application',
  redirect: '/application/dashboard',
  component: resolve => require(['../../views/application/index.vue'], resolve),
  children: [
    // 仪表盘
    {
      path: 'dashboard',
      name: 'dashboard',
      component: resolve => require(['../../views/application/src/dashboard/index.vue'], resolve)
    },
    // 浏览器
    {
      path: 'browser',
      name: 'browser',
      component: resolve => require(['../../views/application/src/browser/index.vue'], resolve)
    },
    // 事务
    {
      path: 'transaction',
      component: resolve => require(['../../views/application/src/transaction/index.vue'], resolve),
      children: [{
        path: '',
        name: 'transaction',
        component: resolve => require(['../../views/application/src/transaction/src/transaction.vue'], resolve)
      },
      {
        path: 'single-transaction',
        name: 'single-transaction',
        component: resolve => require(['../../views/application/src/transaction/src/single-transaction.vue'], resolve)
      }

      ]
    },
    // 远程调用
    {
      path: 'remote',
      component: resolve => require(['../../views/application/src/remote/index.vue'], resolve),
      children: [{
        path: '',
        name: 'remote',
        component: resolve => require(['../../views/application/src/remote/src/remote-list.vue'], resolve)
      },
      {
        path: 'remote-detail',
        name: 'remote-detail',
        component: resolve => require(['../../views/application/src/remote/src/remote-detail.vue'], resolve)
      }
      ]
    },
    // 错误
    {
      path: 'error',
      component: resolve => require(['../../views/application/src/error/index.vue'], resolve),
      children: [{
        path: '',
        name: 'error',
        component: resolve => require(['../../views/application/src/error/src/error.vue'], resolve)
      }]
    },
    // 数据库
    {
      path: 'database',
      component: resolve => require(['../../views/application/src/database/index.vue'], resolve),
      children: [{
        path: '',
        name: 'database',
        component: resolve => require(['../../views/application/src/database/src/database.vue'], resolve)
      }

      ]
    },
    // 报表
    {
      path: 'report',
      name: 'report',
      component: resolve => require(['../../views/application/src/report/index.vue'], resolve)
    },
    // 层
    {
      path: 'tier',
      name: 'tier',
      redirect: {
        name: 'tier-list'
      },
      component: resolve => require(['../../views/application/src/tiers/index.vue'], resolve),
      children: [{
        path: 'list',
        name: 'tier-list',
        component: resolve => require(['../../views/application/src/tiers/src/tier-list.vue'], resolve)
      },
      {
        path: 'detail',
        name: 'tier-detail',
        redirect: {
          name: 'tier-dashboard'
        },
        component: resolve => require(['../../views/application/src/tiers/src/tier-detail.vue'], resolve),
        children: [{
          path: 'dashboard',
          name: 'tier-dashboard',
          component: resolve => require(['../../views/application/src/dashboard/index.vue'], resolve)
        },
        {
          path: 'transaction',
          component: resolve => require(['../../views/application/src/transaction/index.vue'], resolve),
          children: [{
            path: '',
            name: 'tier-transaction',
            component: resolve => require(['../../views/application/src/transaction/src/transaction.vue'], resolve)
          },
          {
            path: 'single-transaction',
            name: 'tier-single-transaction',
            component: resolve => require(['../../views/application/src/transaction/src/single-transaction.vue'], resolve)
          }
          ]
        },
        {
          path: 'database',
          component: resolve => require(['../../views/application/src/database/index.vue'], resolve),
          children: [{
            path: '',
            name: 'tier-database',
            component: resolve => require(['../../views/application/src/database/src/database.vue'], resolve)
          }

          ]
        },
        {
          path: 'remote',
          component: resolve => require(['../../views/application/src/remote/index.vue'], resolve),
          children: [{
            path: '',
            name: 'tier-remote',
            component: resolve => require(['../../views/application/src/remote/src/remote-list.vue'], resolve)
          },
          {
            path: 'remote-detail',
            name: 'tier-remote-detail',
            component: resolve => require(['../../views/application/src/remote/src/remote-detail.vue'], resolve)
          }

          ]
        },
        {
          path: 'error',
          component: resolve => require(['../../views/application/src/error/index.vue'], resolve),
          children: [{
            path: '',
            name: 'tier-error',
            component: resolve => require(['../../views/application/src/error/src/error.vue'], resolve)
          }]
        },
        {
          path: 'jvm',
          name: 'tier-jvm',
          component: resolve => require(['../../views/application/src/jvm/index.vue'], resolve)
        },
        {
          path: 'threaddump',
          component: resolve => require(['../../views/application/src/threaddump/index.vue'], resolve),
          children: [{
            path: '',
            name: 'tier-threaddump',
            component: resolve => require(['../../views/application/src/threaddump/src/threaddump-default.vue'], resolve)
          },
          {
            path: 'report',
            name: 'tier-threaddump-report',
            component: resolve => require(['../../views/application/src/threaddump/src/threaddump-report.vue'], resolve)
          }
          ]
        },
        {
          path: 'environment',
          name: 'tier-environment',
          component: resolve => require(['../../views/application/src/environment/index.vue'], resolve)
        },
        {
          path: 'tuxedo',
          name: 'tier-tuxedo',
          redirect: {
            name: 'tier-tuxedo-current'
          },
          component: resolve => require(['../../views/application/src/tuxedo/index.vue'], resolve),
          children: [{
            path: 'current',
            name: 'tier-tuxedo-current',
            component: resolve => require(['../../views/application/src/tuxedo/src/current.vue'], resolve)
          },
          {
            path: 'server',
            name: 'tier-tuxedo-server',
            component: resolve => require(['../../views/application/src/tuxedo/src/server.vue'], resolve)
          },
          {
            path: 'client',
            name: 'tier-tuxedo-client',
            component: resolve => require(['../../views/application/src/tuxedo/src/client.vue'], resolve)
          }
          ]
        }
        ]
      }
      ]
    },
    // 设置
    {
      path: 'settings',
      component: resolve => require(['../../views/settings/index.vue'], resolve),
      name: 'settings',
      redirect: {
        name: 'tier-list-setting'
      },
      children: [{
        path: 'tier-list-setting',
        name: 'tier-list-setting',
        component: resolve => require(['../../views/settings/src/tier-list-setting.vue'], resolve)
      },
      {
        path: 'instance-list-setting',
        name: 'instance-list-setting',
        component: resolve => require(['../../views/settings/src/instance-list-setting.vue'], resolve)
      },
      {
        path: 'regular-setting',
        name: 'regular-setting',
        component: resolve => require(['../../views/settings/src/regular-setting.vue'], resolve)
      },
      {
        path: 'web-probe-setting',
        name: 'web-probe-setting',
        component: resolve => require(['../../views/settings/src/web-probe-setting.vue'], resolve)
      }
      ]
    }

  ]
}]
