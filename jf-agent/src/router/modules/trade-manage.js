/*
 * @Author: wuyulong
 * @Date: 2020-02-11 16:36:44
 * @LastEditTime: 2020-02-19 20:14:34
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/trade-management.js
 */
const orderQuery = () => import('@/views/trade-manage/order-query/order-query.vue')
const onlineTradeQuery = () => import('@/views/trade-manage/online-trade-query/online-trade-query.vue')
const merchantProductionQuery = () => import('@/views/trade-manage/merchant-production-query/merchant-production-query.vue')
const chargebackQuery = () => import('@/views/trade-manage/chargeback-query/chargeback-query.vue')
const orderPayQuery = () => import('@/views/trade-manage/order-pay-query/order-pay-query.vue')

import Layout from '@/layout'

export default {
  path: '/trade-management',
  component: Layout,
  redirect: '/trade-management/order-query',
  name: 'trade-management',
  meta: {
    title: '交易管理',
    icon: 'chart'
  },
  children: [
    {
      path: '/trade-management/order-query',
      name: 'orderQuery',
      component: orderQuery,
      meta: {
        title: '订单查询',
        keepAlive: false
      }
    },
    {
      path: '/trade-management/online-trade-query',
      name: 'onlineTradeQuery',
      component: onlineTradeQuery,
      meta: {
        title: '在线交易订单查询',
        keepAlive: false
      }
    },
    {
      path: '/trade-management/merchant-production-query',
      name: 'merchantProductionQuery',
      component: merchantProductionQuery,
      meta: {
        title: '商户产品费用查询',
        keepAlive: false
      }
    },
    {
      path: '/trade-management/chargeback-query',
      name: 'chargebackQuery',
      component: chargebackQuery,
      meta: {
        title: '退单查询',
        keepAlive: false
      }
    },
    {
      path: '/trade-management/order-pay-query',
      name: 'orderPayQuery',
      component: orderPayQuery,
      meta: {
        title: '订单支付查询',
        keepAlive: false
      }
    }
  ]
}
