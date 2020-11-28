/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:50:15
 * @LastEditTime: 2020-02-19 20:48:26
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/kaishua-manage.js
 */
let ishua_pos_query = () => import('@/views/kaishua-manage/ishua-pos-query/ishua-pos-query.vue');
let ishua_order_query = () => import('@/views/kaishua-manage/ishua-order-query/ishua-order-query.vue');
let ishua_spread_census = () => import('@/views/kaishua-manage/ishua-spread-census/ishua-spread-census.vue');
let ishua_recommend_query = () => import('@/views/kaishua-manage/ishua-recommend-query/ishua-recommend-query.vue');
let ishua_pos_send = () => import('@/views/kaishua-manage/ishua-pos-send/ishua-pos-send.vue');
let ishua_recommend_dealquery = () => import('@/views/kaishua-manage/ishua-recommend-dealquery/ishua-recommend-dealquery.vue');
let ishua_cashback_census = () => import('@/views/kaishua-manage/ishua-cashback-census/ishua-cashback-census.vue');
let ishua_activity_feeset = () => import('@/views/kaishua-manage/ishua-activity-feeset/ishua-activity-feeset.vue');
let add_ishua_customer = () => import('@/views/kaishua-manage/add-ishua-customer/add-ishua-customer.vue');
let ishua_activity_customer_feeset = () => import('@/views/kaishua-manage/ishua-activity-customer-feeset/ishua-activity-customer-feeset.vue');
let ishua_activity_branch_feeset = () => import('@/views/kaishua-manage/ishua-activity-branch-feeset/ishua-activity-branch-feeset.vue');
let kaishua_pos_distribute = () => import('@/views/kaishua-manage/kaishua-pos-distribute/kaishua-pos-distribute.vue');
let distributed_pos_query = () => import('@/views/kaishua-manage/distributed-pos-query/distributed-pos-query.vue');
let kaishua_pos_recovery = () => import('@/views/kaishua-manage/kaishua-pos-recovery/kaishua-pos-recovery.vue');
let ishua_again_amount = () => import('@/views/kaishua-manage/ishua-again-amount/ishua-again-amount.vue');
let ishua_customer_examine = () => import('@/views/kaishua-manage/ishua-customer-examine/ishua-customer-examine.vue');

import Layout from '@/layout';

export default{
    path: '/kaishua-manage',
    component: Layout,
    redirect: '/kaishua-manage/ishua-pos-query',
    name: 'kaishua-manage',
    meta: {
        title: '开刷管理',
        icon: 'nested'
    },
    children:[
        {
            path: "/kaishua-manage/ishua-pos-query",
            name: "ishua-pos-query",
            component: ishua_pos_query,
            meta: {
                title: "i刷终端查询",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-order-query",
            name: "ishua-order-query",
            component: ishua_order_query,
            meta: {
                title: "i刷活动订单查询",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-spread-census",
            name: "ishua-spread-census",
            component: ishua_spread_census,
            meta: {
                title: "i刷服务商推广统计",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-recommend-query",
            name: "ishua-recommend-query",
            component: ishua_recommend_query,
            meta: {
                title: "i刷推荐商户查询",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-pos-send",
            name: "ishua-pos-send",
            component: ishua_pos_send,
            meta: {
                title: "i刷机具配送",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-recommend-dealquery",
            name: "ishua-recommend-dealquery",
            component: ishua_recommend_dealquery,
            meta: {
                title: "i刷推荐商户交易查询",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-cashback-census",
            name: "ishua-cashback-census",
            component: ishua_cashback_census,
            meta: {
                title: "I刷活动返现统计",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/add-ishua-customer",
            name: "add-ishua-customer",
            component: add_ishua_customer,
            meta: {
                title: "新增i刷商户申请",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-activity-feeset",
            name: "ishua-activity-feeset",
            component: ishua_activity_feeset,
            meta: {
                title: "I刷活动费率设置",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-activity-customer-feeset",
            name: "ishua-activity-customer-feeset",
            component: ishua_activity_customer_feeset,
            meta: {
                title: "I刷活动商户费率设置",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-activity-branch-feeset",
            name: "ishua-activity-branch-feeset",
            component: ishua_activity_branch_feeset,
            meta: {
                title: "I刷活动分支机构费率设置",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/kaishua-pos-distribute",
            name: "kaishua-pos-distribute",
            component: kaishua_pos_distribute,
            meta: {
                title: "开刷机具分配",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/distributed-pos-query",
            name: "distributed-pos-query",
            component: distributed_pos_query,
            meta: {
                title: "已分配机具查询",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/kaishua-pos-recovery",
            name: "kaishua-pos-recovery",
            component: kaishua_pos_recovery,
            meta: {
                title: "开刷机具回收",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-again-amount",
            name: "ishua-again-amount",
            component: ishua_again_amount,
            meta: {
                title: "i刷商户再次提额",
                keepAlive: false
            }
        },
        {
            path: "/kaishua-manage/ishua-customer-examine",
            name: "ishua-customer-examine",
            component: ishua_customer_examine,
            meta: {
                title: "i刷商户资质审核",
                keepAlive: false
            }
        }
    ]    
} 
