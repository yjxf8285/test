/*
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:38
 * @LastEditTime: 2020-05-09 15:22:39
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/router/modules/data-manage.js
 */
let data_download = () => import('@/views/data-manage/data-download/data-download.vue');
let data_management = () => import('@/views/data-manage/data-manage/data-manage.vue');
let agreement_uplaod = () => import('@/views/data-manage/agreement-uplaod/agreement-uplaod.vue');
let export_apply_query = () => import('@/views/data-manage/export-apply-query/export-apply-query.vue');

import Layout from '@/layout';

export default {
    path: '/data-manage',
    component: Layout,
    redirect: '/data-manage/data-download',
    name: 'data-manage',
    meta: {
        title: '资料管理',
        icon: 'excel'
    },
    children:[
        // {
        //     path: "/data-manage/data-download",
        //     name: "data-download",
        //     component: data_download,
        //     meta: {
        //         title: "资料下载",
        //         keepAlive: false
        //     }
        // },
        {
            path: "/data-manage/data-manage",
            name: "data_management",
            component: data_management,
            meta: {
                title: "资料管理",
                keepAlive: false
            }
        },
        {
            path: "/data-manage/agreement-uplaod",
            name: "agreement-uplaod",
            component: agreement_uplaod,
            meta: {
                title: "商户协议上传",
                keepAlive: false
            }
        },
        // {
        //     path: "/data-manage/export-apply-query",
        //     name: "export-apply-query",
        //     component: export_apply_query,
        //     meta: {
        //         title: "导出申请查询",
        //         keepAlive: false
        //     }
        // }
    ]
}