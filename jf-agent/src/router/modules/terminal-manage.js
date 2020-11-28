let traditionTerminalQuery = () => import("@/views/terminal-manage/tradition-terminal-query/tradition-terminal-query.vue");
let terminalQuery = () => import("@/views/terminal-manage/terminal-query/terminal-query.vue");
let machineAllot = () => import("@/views/terminal-manage/machine-allot/machine-allot.vue");
let machineRecycle = () => import("@/views/terminal-manage/machine-recycle/machine-recycle.vue");
let terminalCount = () => import("@/views/terminal-manage/terminal-count/terminal-count.vue");
let machineAllotQuery = () => import("@/views/terminal-manage/machine-allot-query/machine-allot-query.vue");
let terminalAllotQuery = () => import("@/views/terminal-manage/terminal-allot-query/terminal-allot-query.vue");
let posBindApply = () => import("@/views/terminal-manage/pos-bind-apply/pos-bind-apply.vue");
let posBindOrderQuery = () => import("@/views/terminal-manage/pos-bind-order-query/pos-bind-order-query.vue");
let posAdjustApply = () => import("@/views/terminal-manage/pos-adjust-apply/pos-adjust-apply.vue");
let posCargoOrderQuery = () => import("@/views/terminal-manage/pos-cargo-order-query/pos-cargo-order-query.vue");
let machinePurchaseOrderQuery = () => import("@/views/terminal-manage/machine-purchase-order-query/machine-purchase-order-query.vue");
let machinePurchaseApply = () => import("@/views/terminal-manage/machine-purchase-apply/machine-purchase-apply.vue");
let qsfApply = () => import("@/views/terminal-manage/qsf-apply/qsf-apply.vue");
let purchaseOrderQuery = () => import("@/views/terminal-manage/purchase-order-query/purchase-order-query.vue");
let qsfOrderQuery = () => import("@/views/terminal-manage/qsf-order-query/qsf-order-query.vue");
let qsfBindHistoryQuery = () => import("@/views/terminal-manage/qsf-bind-history-query/qsf-bind-history-query.vue");
let machineRepairApply = () => import("@/views/terminal-manage/machine-repair-apply/machine-repair-apply.vue");
let machineRepairApplyOrderQuery = () => import("@/views/terminal-manage/machine-repair-apply-order-query/machine-repair-apply-order-query.vue");
let terminalUpgradeCount = () => import("@/views/terminal-manage/terminal-upgrade-count/terminal-upgrade-count.vue");
let terminalUpgradeInfoQuery = () => import("@/views/terminal-manage/terminal-upgrade-info-query/terminal-upgrade-info-query.vue");
let transferOrderQuery = () => import("@/views/terminal-manage/transfer-order-query/transfer-order-query.vue");
let posBindHistoryQuery = () => import("@/views/terminal-manage/pos-bind-history-query/pos-bind-history-query.vue");
let posPopularMerchantAudit = () => import("@/views/terminal-manage/pos-popular-merchant-audit/pos-popular-merchant-audit.vue");
let machineAllotNew = () => import("@/views/terminal-manage/machine-allot-new/machine-allot-new.vue");
let machineAllotQueryNew = () => import("@/views/terminal-manage/machine-allot-query-new/machine-allot-query-new.vue");

import Layout from '@/layout';

export default{
    path: '/terminal-management',
    component: Layout,
    redirect: '/terminal-management/tradition-terminal-query',
    name: 'terminal-management',
    meta: {
        title: '终端管理',
        icon: 'clipboard'
    },
    children:[
        {
            path: "/terminal-management/tradition-terminal-query",
            name: "traditionTerminalQuery",
            component: traditionTerminalQuery,
            meta: {
                title: "传统终端查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/terminal-query",
            name: "terminalQuery",
            component: terminalQuery,
            meta: {
                title: "终端查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-allot",
            name: "machineAllot",
            component: machineAllot,
            meta: {
                title: "机具分配",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-recycle",
            name: "machineRecycle",
            component: machineRecycle,
            meta: {
                title: "机具回收",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/terminal-count",
            name: "terminalCount",
            component: terminalCount,
            meta: {
                title: "终端统计",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-allot-query",
            name: "machineAllotQuery",
            component: machineAllotQuery,
            meta: {
                title: "已分配机具查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/terminal-allot-query",
            name: "terminalAllotQuery",
            component: terminalAllotQuery,
            meta: {
                title: "终端分配查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-bind-apply",
            name: "posBindApply",
            component: posBindApply,
            meta: {
                title: "POS绑定申请",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-bind-order-query",
            name: "posBindOrderQuery",
            component: posBindOrderQuery,
            meta: {
                title: "POS绑定单查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-adjust-apply",
            name: "posAdjustApply",
            component: posAdjustApply,
            meta: {
                title: "POS名额调整申请",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-cargo-order-query",
            name: "posCargoOrderQuery",
            component: posCargoOrderQuery,
            meta: {
                title: "POS到货单查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-purchase-order-query",
            name: "machinePurchaseOrderQuery",
            component: machinePurchaseOrderQuery,
            meta: {
                title: "机具采购单查询-OLD",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-purchase-apply",
            name: "machinePurchaseApply",
            component: machinePurchaseApply,
            meta: {
                title: "机具采购申请",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/qsf-apply",
            name: "qsfApply",
            component: qsfApply,
            meta: {
                title: "轻松富申请",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/purchase-order-query",
            name: "purchaseOrderQuery",
            component: purchaseOrderQuery,
            meta: {
                title: "采购单查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/qsf-order-query",
            name: "qsfOrderQuery",
            component: qsfOrderQuery,
            meta: {
                title: "轻松富单据查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/qsf-bind-history-query",
            name: "qsfBindHistoryQuery",
            component: qsfBindHistoryQuery,
            meta: {
                title: "轻松富绑定历史查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-repair-apply",
            name: "machineRepairApply",
            component: machineRepairApply,
            meta: {
                title: "机具维修申请",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-repair-apply-order-query",
            name: "machineRepairApplyOrderQuery",
            component: machineRepairApplyOrderQuery,
            meta: {
                title: "机具维修申请单查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/terminal-upgrade-count",
            name: "terminalUpgradeCount",
            component: terminalUpgradeCount,
            meta: {
                title: "终端升级统计",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/terminal-upgrade-info-query",
            name: "terminalUpgradeInfoQuery",
            component: terminalUpgradeInfoQuery,
            meta: {
                title: "终端升级信息查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/transfer-order-query",
            name: "transferOrderQuery",
            component: transferOrderQuery,
            meta: {
                title: "划拨单查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-bind-history-query",
            name: "posBindHistoryQuery",
            component: posBindHistoryQuery,
            meta: {
                title: "POS绑定历史查询",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/pos-popular-merchant-audit",
            name: "posPopularMerchantAudit",
            component: posPopularMerchantAudit,
            meta: {
                title: "POS推广商户审核",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-allot-new",
            name: "machineAllotNew",
            component: machineAllotNew,
            meta: {
                title: "机具分配-（新）",
                keepAlive: false
            }
        },
        {
            path: "/terminal-management/machine-allot-query-new",
            name: "machineAllotQueryNew",
            component: machineAllotQueryNew,
            meta: {
                title: "已分配机具查询（新）",
                keepAlive: false
            }
        }
    ]
} 