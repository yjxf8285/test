/*
 * @Author: wuyulong
 * @Date: 2020-01-02 17:51:18
 * @LastEditTime: 2020-05-09 15:23:20
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/router/modules/system-manage.js
 */

let operator_manage = () => import('@/views/system-manage/operator-manage/operator-manage.vue');
let perfer_merchant_import = () => import('@/views/system-manage/perfer-merchant-import/perfer-merchant-import.vue');
let login_journal_query = () => import('@/views/system-manage/login-journal-query/login-journal-query.vue');
let function_manage = () => import('@/views/system-manage/function-manage/function-manage.vue');
let scan_merchant_feeModel = () => import('@/views/system-manage/scan-merchant-feemodel/scan-merchant-feemodel.vue');
let add_account = () => import('@/views/system-manage/add-account/add-account.vue');
let batch_modify_operator = () => import('@/views/system-manage/batch-modify-operator/batch-modify-operator.vue');
let manage_account = () => import('@/views/system-manage/manage-account/manage-account.vue');
let roles_manage = () => import('@/views/system-manage/roles-manage/roles-manage.vue');
let account_cost_setup = () => import('@/views/system-manage/account-cost-setup/account-cost-setup.vue');
let account_cost_query = () => import('@/views/system-manage/account-cost-query/account-cost-query.vue');
let menu_manage = () => import('@/views/system-manage/menu-manage/menu-manage.vue');
let sale_transfer_agent= () => import('@/views/system-manage/sale-transfer-agent/sale-transfer-agent.vue');
let agent_operator_manage = () => import('@/views/system-manage/agent-operator-manage/agent-operator-manage.vue');
let system_notice = () => import('@/views/system-manage/system-notice/system-notice.vue');

import Layout from '@/layout';


export default{
    path: '/system-manage',
    component: Layout,
    redirect: '/system-manage/operator-manage',
    name: 'system-manage',
    meta: {
        title: '系统管理',
        icon: 'guide'
    },
    children:[
        {
            path: "/system-manage/operator-manage",
            name: "operator-manage",
            component: operator_manage,
            meta: {
                title: "操作员管理",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/perfer-merchant-import",
            name: "perfer-merchant-import",
            component: perfer_merchant_import,
            meta: {
                title: "优惠商户批量导入",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/login-journal-query",
            name: "login-journal-query",
            component: login_journal_query,
            meta: {
                title: "登录日志查询",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/function-manage",
            name: "function-manage",
            component: function_manage,
            meta: {
                title: "功能管理",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/scan-merchant-feemodel",
            name: "scan-merchant-feemodel",
            component: scan_merchant_feeModel,
            meta: {
                title: "扫码商户费率模板",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/add-account",
            name: "add-account",
            component: add_account,
            meta: {
                title: "新增账户",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/batch-modify-operator",
            name: "batch-modify-operator",
            component: batch_modify_operator,
            meta: {
                title: "批量修改操作员角色",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/manage-account",
            name: "manage-account",
            component: manage_account,
            meta: {
                title: "管理账户",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/roles-manage",
            name: "roles-manage",
            component: roles_manage,
            meta: {
                title: "角色管理",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/account-cost-query",
            name: "account-cost-query",
            component: account_cost_query,
            meta: {
                title: "账户成本查询",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/account-cost-setup",
            name: "account-cost-setup",
            component: account_cost_setup,
            meta: {
                title: "账户成本设置",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/menu-manage",
            name: "menu-manage",
            component: menu_manage,
            meta: {
                title: "菜单管理",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/sale-transfer-agent",
            name: "sale-transfer-agent",
            component: sale_transfer_agent,
            meta: {
                title: "销售转分支机构",
                keepAlive: false
            }
        },
        {
            path: "/system-manage/agent-operator-manage",
            name: "agent-operator-manage",
            component: agent_operator_manage,
            meta: {
                title: "代理商操作员管理",
                keepAlive: false
            }
        }
        // {
        //     path: "/system-manage/system-notice",
        //     name: "system-notice",
        //     component: system_notice,
        //     meta: {
        //         title: "系统公告",
        //         keepAlive: false
        //     }
        // }
        
    ]
} 





