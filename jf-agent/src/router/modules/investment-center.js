/*
 * @Author: wuyulong
 * @Date: 2020-02-19 16:16:23
 * @LastEditTime: 2020-02-19 20:45:53
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/investment-center.js
 */
let machineTransfer = () => import("@/views/investment-center/machine-transfer/machine-transfer.vue");
let tradeQuery = () => import("@/views/investment-center/trade-query/trade-query.vue");
let activateQuery = () => import("@/views/investment-center/activate-query/activate-query.vue");

import Layout from '@/layout';

export default{
    path: '/investment-center',
    component: Layout,
    redirect: '/investment-center/trade-query',
    name: 'investment-center',
    meta: {
        title: '招商中心',
        icon: 'money'
    },
    children:[
        {
            path: "/investment-center/trade-query",
            name: "tradeQuery",
            component: tradeQuery,
            meta: {
                title: "交易查询",
                keepAlive: false
            }
        },
        {
            path: "/investment-center/machine-transfer",
            name: "machineTransfer",
            component: machineTransfer,
            meta: {
                title: "机具划拨",
                keepAlive: false
            }
        },
        {
            path: "/investment-center/activate-query",
            name: "activateQuery",
            component: activateQuery,
            meta: {
                title: "激活查询",
                keepAlive: false
            }
        },
    ]
} 