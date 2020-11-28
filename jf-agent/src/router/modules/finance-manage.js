/*
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:38
 * @LastEditTime: 2020-02-19 20:37:38
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/finance-manage.js
 */
let unionPay_recovery_query = () => import('@/views/finance-manage/unionpay-recovery-query/unionpay-recovery-query.vue');
let customer_payment_info = () => import('@/views/finance-manage/customer-payment-info/customer-payment-info.vue');
let violate_customer_query = () => import('@/views/finance-manage/violate-customer-query/violate-customer-query.vue');
let history_payment_info = () => import('@/views/finance-manage/history-payment-info/history-payment-info.vue');

import Layout from '@/layout';

export default
{
    path: '/finance-manage',
    component: Layout,
    redirect: '/finance-manage/unionpay-recovery-query',
    name: 'finance-manage',
    meta: {
        title: '财务管理',
        icon: 'money'
    },
    children:[
        {
            path: "/finance-manage/unionpay-recovery-query",
            name: "unionpay-recovery-query",
            component: unionPay_recovery_query,
            meta: {
                title: "银联商户清算追偿信息查询",
                keepAlive: false
            }
        },
        {
            path: "/finance-manage/customer-payment-info",
            name: "customer-payment-info",
            component: customer_payment_info,
            meta: {
                title: "商户付款单查询",
                keepAlive: false
            }
        },
        {
            path: "/finance-manage/violate-customer-query",
            name: "violate-customer-query",
            component: violate_customer_query,
            meta: {
                title: "疑似违规商户名单查询",
                keepAlive: false
            }
        },
        {
            path: "/finance-manage/history-payment-info",
            name: "history-payment-info",
            component: history_payment_info,
            meta: {
                title: "商户历史付款单查询",
                keepAlive: false
            }
        }
    ]
} 