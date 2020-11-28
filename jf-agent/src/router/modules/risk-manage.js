/*
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:38
 * @LastEditTime: 2020-02-19 20:38:23
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/risk-manage.js
 */
let merchant_blacklist_defend = () => import('@/views/risk-manage/merchant-blacklist-defend/merchant-blacklist-defend.vue');
let risk_case_query = () => import('@/views/risk-manage/risk-case-query/risk-case-query.vue');
let deal_blacklist_defend = () => import('@/views/risk-manage/deal-blacklist-defend/deal-blacklist-defend.vue');
let charge_back_complain = () => import('@/views/risk-manage/charge-back-complain/charge-back-complain.vue');
let order_request_query = () => import('@/views/risk-manage/order-request-query/order-request-query.vue');
let agent_error_query = () => import('@/views/risk-manage/agent-error-query/agent-error-query.vue');

import Layout from '@/layout';


export default{
    path: '/risk-manage',
    component: Layout,
    redirect: '/risk-manage/merchant-blacklist-defend',
    name: 'risk-manage',
    meta: {
        title: '风险管理',
        icon: 'bug'
    },
    children:[
        {
            path: "/risk-manage/merchant-blacklist-defend",
            name: "merchant-blacklist-defend",
            component: merchant_blacklist_defend,
            meta: {
                title: "入网黑名单维护",
                keepAlive: false
            }
        },
        {
            path: "/risk-manage/risk-case-query",
            name: "risk-case-query",
            component: risk_case_query,
            meta: {
                title: "风险案例查询",
                keepAlive: false
            }
        },
        {
            path: "/risk-manage/deal-blacklist-defend",
            name: "deal-blacklist-defend",
            component: deal_blacklist_defend,
            meta: {
                title: "交易黑名单维护",
                keepAlive: false
            }
        },
        {
            path: "/risk-manage/charge-back-complain",
            name: "charge-back-complain",
            component: charge_back_complain,
            meta: {
                title: "退单申诉",
                keepAlive: false
            }
        },
        {
            path: "/risk-manage/order-request-query",
            name: "order-request-query",
            component: order_request_query,
            meta: {
                title: "调单请求查询",
                keepAlive: false
            }
        },
        {
            path: "/risk-manage/agent-error-query",
            name: "agent-error-query",
            component: agent_error_query,
            meta: {
                title: "服务商异常付款单查询",
                keepAlive: false
            }
        }
    ]
} 