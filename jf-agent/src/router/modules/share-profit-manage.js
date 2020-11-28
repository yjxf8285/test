let shareProfitManagement = () => import("@/views/share-profit-manage/agent-share-profit-query/agent-share-profit-query.vue");
let shareProfitQuery = () => import("@/views/share-profit-manage/share-profit-query/share-profit-query.vue");
let facilitatorShareBusinessQuery = () => import("@/views/share-profit-manage/facilitator-share-business-query/facilitator-share-business-query.vue");
let facilitatorProductionShareQuery = () => import("@/views/share-profit-manage/facilitator-production-share-query/facilitator-production-share-query.vue");
let facilitatorProductionShareQueryMonth = () => import("@/views/share-profit-manage/facilitator-production-share-query-month/facilitator-production-share-query-month.vue");
let branchShareProfit = () => import("@/views/share-profit-manage/branch-share-profit/branch-share-profit.vue");
let branchShareProfitNew = () => import("@/views/share-profit-manage/branch-share-profit-new/branch-share-profit-new.vue");
let branchCostSetting = () => import("@/views/share-profit-manage/branch-cost-setting/branch-cost-setting.vue");
let billManage = () => import("@/views/share-profit-manage/bill-manage/bill-manage.vue");
let facilitatorTradeMonthShare = () => import("@/views/share-profit-manage/facilitator-trade-month-share/facilitator-trade-month-share.vue");
let facilitatorShareWithdraw = () => import("@/views/share-profit-manage/facilitator-share-withdraw/facilitator-share-withdraw.vue");
let shareProfitConfig = () => import("@/views/share-profit-manage/share-profit-config/share-profit-config.vue");
let agentReturnQuery = () => import("@/views/share-profit-manage/agent-return-query/agent-return-query.vue");
let activateDataQuery = () => import("@/views/share-profit-manage/activate-data-query/activate-data-query.vue");
let facilitatorDailyShareConfig = () => import("@/views/share-profit-manage/facilitator-daily-share-config/facilitator-daily-share-config.vue");

import Layout from '@/layout';


export default {
    path: '/share-profit-management',
    component: Layout,
    redirect: '/share-profit-management/agent-share-profit-query',
    name: 'share-profit-management',
    meta: {
        title: '分润管理',
        icon: 'money'
    },
    children: [
        {
            path: "/share-profit-management/agent-share-profit-query",
            name: "shareProfitManagement",
            component: shareProfitManagement,
            meta: {
                title: "代理商日分润查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/share-profit-query",
            name: "shareProfitQuery",
            component: shareProfitQuery,
            meta: {
                title: "分润查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-share-business-query",
            name: "facilitatorShareBusinessQuery",
            component: facilitatorShareBusinessQuery,
            meta: {
                title: "服务商分润业务查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-production-share-query",
            name: "facilitatorProductionShareQuery",
            component: facilitatorProductionShareQuery,
            meta: {
                title: "服务商产品分润查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-production-share-query-month",
            name: "facilitatorProductionShareQueryMonth",
            component: facilitatorProductionShareQueryMonth,
            meta: {
                title: "服务商产品月分润查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/branch-share-profit",
            name: "branchShareProfit",
            component: branchShareProfit,
            meta: {
                title: "分支机构分润",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/branch-share-profit-new",
            name: "branchShareProfitNew",
            component: branchShareProfitNew,
            meta: {
                title: "分支机构分润(新)",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/branch-cost-setting",
            name: "branchCostSetting",
            component: branchCostSetting,
            meta: {
                title: "分支机构成本设置",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/bill-manage",
            name: "billManage",
            component: billManage,
            meta: {
                title: "发票管理",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-trade-month-share",
            name: "facilitatorTradeMonthShare",
            component: facilitatorTradeMonthShare,
            meta: {
                title: "服务商交易月分润",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-share-withdraw",
            name: "facilitatorShareWithdraw",
            component: facilitatorShareWithdraw,
            meta: {
                title: "服务商分润提现",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/share-profit-config",
            name: "shareProfitConfig",
            component: shareProfitConfig,
            meta: {
                title: "分润日结代发配置",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/agent-return-query",
            name: "agentReturnQuery",
            component: agentReturnQuery,
            meta: {
                title: "代理商月返现查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/activate-data-query",
            name: "activateDataQuery",
            component: activateDataQuery,
            meta: {
                title: "激活数据查询",
                keepAlive: false
            }
        },
        {
            path: "/share-profit-management/facilitator-daily-share-config",
            name: "facilitatorDailyShareConfig",
            component: facilitatorDailyShareConfig,
            meta: {
                title: "服务商日结分润配置",
                keepAlive: false
            }
        }
    ]
} 