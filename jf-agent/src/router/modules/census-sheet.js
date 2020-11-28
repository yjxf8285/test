/*
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:38
 * @LastEditTime: 2020-03-02 16:29:42
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/census-sheet.js
 */

import Layout from '@/layout';

let merchant_deal_census = () => import('@/views/census-sheet/merchant-deal-census/merchant-deal-census.vue');
let merchant_lost_census = () => import('@/views/census-sheet/merchant-lost-census/merchant-lost-census.vue');
let investment_center_data = () => import('@/views/census-sheet/investment-center-data/investment-center-data.vue');



export default {
    path: '/census-sheet',
    component: Layout,
    redirect: 'noRedirect',
    name: 'census-sheet',
    meta: {
        title: '统计报表',
        icon: 'chart'
    },
    children:[
        {
            path: "/census-sheet/merchant-deal-census",
            name: "merchant-deal-census",
            component: merchant_deal_census,
            meta: {
                title: "商户交易统计",
                keepAlive: false
            }
        },
        {
            path: "/census-sheet/merchant-lost-census",
            name: "merchant-lost-census",
            component: merchant_lost_census,
            meta: {
                title: "商户流失统计",
                keepAlive: false
            }
        },
        {
            path: "/census-sheet/investment-center-data",
            name: "investment-center-data",
            component: investment_center_data,
            meta: {
                title: "招商中心数据查询",
                keepAlive: false
            }
        }
    ]
}