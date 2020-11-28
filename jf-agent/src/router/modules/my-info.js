/*
 * @Author: wuyulong
 * @Date: 2020-01-08 14:39:05
 * @LastEditTime: 2020-02-19 20:36:26
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/my-info.js
 */
let my_info = () => import('@/views/my-info/my-info/my-info.vue');
let give_vip = () => import('@/views/my-info/give-vip/give-vip.vue');
let electron_contract_add = () => import('@/views/my-info/electron-contract-add/electron-contract-add.vue');
let baseinfo_change_apply = () => import('@/views/my-info/baseinfo-change-apply/baseinfo-change-apply.vue');
let my_level = () => import('@/views/my-info/my-level/my-level.vue');
let baseinfo_change_query = () => import('@/views/my-info/baseinfo-change-query/baseinfo-change-query.vue');
let admin_delete_operator = () => import('@/views/my-info/admin-delete-operator/admin-delete-operator.vue');
let admin_pos_delete = () => import('@/views/my-info/admin-pos-delete/admin-pos-delete.vue');
let admin_apply_export = () => import('@/views/my-info/admin-apply-export/admin-apply-export.vue'); 
let admin_open_operator = () => import('@/views/my-info/admin-open-operator/admin-open-operator.vue'); 
let admin_process_control = () => import('@/views/my-info/admin-process-control/admin-process-control.vue'); 
let industry_change_apply = () => import('@/views/my-info/industry-change-apply/industry-change-apply.vue'); 
let industry_change_query = () => import('@/views/my-info/industry-change-query/industry-change-query.vue'); 

import Layout from '@/layout';


export default{
    path: '/my-info',
    component: Layout,
    redirect: '/my-info/my-info',
    name: 'my-info',
    meta: {
        title: '我的信息',
        icon: 'user'
    },
    children:[
        {
            path: "/my-info/my-info",
            name: "feedBack",
            component: my_info,
            meta: {
                title: "我的信息",
                keepAlive: false
            }
        },{
            path: "/give-vip/give-vip",
            name: "give-vip",
            component: give_vip,
            meta: {
                title: "赠送VIP名额",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/electron-contract-add",
            name: "electron-contract-add",
            component: electron_contract_add,
            meta: {
                title: "电子合同补录",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/baseinfo-change-apply",
            name: "baseinfo-change-apply",
            component: baseinfo_change_apply,
            meta: {
                title: "基本信息变更申请",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/my-level",
            name: "my-level",
            component: my_level,
            meta: {
                title: "我的级别",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/baseinfo-change-query",
            name: "baseinfo-change-query",
            component: baseinfo_change_query,
            meta: {
                title: "基本信息变更查询",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/admin-delete-operator",
            name: "admin-delete-operator",
            component: admin_delete_operator,
            meta: {
                title: "管理员-删除商户操作员",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/admin-pos-delete",
            name: "admin-pos-delete",
            component: admin_pos_delete,
            meta: {
                title: "管理员-机具删除",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/admin-apply-export",
            name: "admin-apply-export",
            component: admin_apply_export,
            meta: {
                title: "管理员-申请导出配置",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/admin-open-operator",
            name: "admin-open-operator",
            component: admin_open_operator,
            meta: {
                title: "管理员-开通商户操作员",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/admin-process-control",
            name: "admin-process-control",
            component: admin_process_control,
            meta: {
                title: "管理员-开关流程控制",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/industry-change-apply",
            name: "industry-change-apply",
            component: industry_change_apply,
            meta: {
                title: "工商变更申请",
                keepAlive: false
            }
        },
        {
            path: "/give-vip/industry-change-query",
            name: "industry-change-query",
            component: industry_change_query,
            meta: {
                title: "工商变更申请查询",
                keepAlive: false
            }
        }
    ]
} 







