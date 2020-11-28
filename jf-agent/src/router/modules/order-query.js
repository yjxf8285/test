
let facilitatorShareInfoConfirm = () => import("@/views/order-query/facilitator-share-info-confirm/facilitator-share-info-confirm.vue");
let deleteMerchantQuery = () => import("@/views/order-query/delete-merchant-query/delete-merchant-query.vue");
let rateChangeQuery = () => import("@/views/order-query/rate-change-query/rate-change-query.vue");
let basicInfoChangeQuery = () => import("@/views/order-query/basic-info-change-query/basic-info-change-query.vue");
let merchantRateModifyQuery = () => import("@/views/order-query/merchant-rate-modify-query/merchant-rate-modify-query.vue");
let branchChangeOrderQuery = () => import("@/views/order-query/branch-change-order-query/branch-change-order-query.vue");
let merchantResultInfoQuery = () => import("@/views/order-query/merchant-result-info-query/merchant-result-info-query.vue");
let searchAllChangeMerchant = () => import("@/views/order-query/search-all-change-merchant/search-all-change-merchant.vue");
let merchantNewMachineQuery = () => import("@/views/order-query/merchant-new-machine-query/merchant-new-machine-query.vue");
let merchantPreAuthorizationApplyQuery = () => import("@/views/order-query/merchant-pre-authorization-apply-query/merchant-pre-authorization-apply-query.vue");
let merchantIntegralApply = () => import("@/views/order-query/merchant-integral-apply/merchant-integral-apply.vue");
let merchantChangeOrderQuery = () => import("@/views/order-query/merchant-change-order-query/merchant-change-order-query.vue");
let companyInfoChangeOrderQuery = () => import("@/views/order-query/company-info-change-order-query/company-info-change-order-query.vue");
let merchantAptitudeChangeOrderQuery = () => import("@/views/order-query/merchant-aptitude-change-order-query/merchant-aptitude-change-order-query.vue");
let facilitatorShareOrderQuery = () => import("@/views/order-query/facilitator-share-order-query/facilitator-share-order-query.vue");
let merchantProblem = () => import("@/views/order-query/merchant-problem/merchant-problem.vue");
let historyWorkOrderQuery = () => import("@/views/order-query/history-work-order-query/history-work-order-query.vue");

import Layout from '@/layout';

export default {
    path: '/order-query',
    component: Layout,
    redirect: '/order-query/facilitator-share-info-confirm',
    name: 'order-query',
    meta: {
        title: '单据查询',
        icon: 'search'
    },
    children:[
        {
            path: "/order-query/facilitator-share-info-confirm",
            name: "facilitatorShareInfoConfirm",
            component: facilitatorShareInfoConfirm,
            meta: {
                title: "服务商分润信息确认",
                keepAlive: false
            }
        },
        {
            path: "/order-query/delete-merchant-query",
            name: "deleteMerchantQuery",
            component: deleteMerchantQuery,
            meta: {
                title: "删除商户查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/rate-change-query",
            name: "rateChangeQuery",
            component: rateChangeQuery,
            meta: {
                title: "费率变更查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/basic-info-change-query",
            name: "basicInfoChangeQuery",
            component: basicInfoChangeQuery,
            meta: {
                title: "基本信息变更查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-rate-modify-query",
            name: "merchantRateModifyQuery",
            component: merchantRateModifyQuery,
            meta: {
                title: "商户费率整改查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/branch-change-order-query",
            name: "branchChangeOrderQuery",
            component: branchChangeOrderQuery,
            meta: {
                title: "网点变更单查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-result-info-query",
            name: "merchantResultInfoQuery",
            component: merchantResultInfoQuery,
            meta: {
                title: "商户结算信息变更查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/search-all-change-merchant",
            name: "searchAllChangeMerchant",
            component: searchAllChangeMerchant,
            meta: {
                title: "查询所有整改商户",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-new-machine-query",
            name: "merchantNewMachineQuery",
            component: merchantNewMachineQuery,
            meta: {
                title: "商户增机查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-pre-authorization-apply-query",
            name: "merchantPreAuthorizationApplyQuery",
            component: merchantPreAuthorizationApplyQuery,
            meta: {
                title: "商户预授权申请查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-integral-apply",
            name: "merchantIntegralApply",
            component: merchantIntegralApply,
            meta: {
                title: "商户积分申请",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-change-order-query",
            name: "merchantChangeOrderQuery",
            component: merchantChangeOrderQuery,
            meta: {
                title: "商户整改单查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/company-info-change-order-query",
            name: "companyInfoChangeOrderQuery",
            component: companyInfoChangeOrderQuery,
            meta: {
                title: "企业信息变更查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-aptitude-change-order-query",
            name: "merchantAptitudeChangeOrderQuery",
            component: merchantAptitudeChangeOrderQuery,
            meta: {
                title: "商户资质整改单据查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/facilitator-share-order-query",
            name: "facilitatorShareOrderQuery",
            component: facilitatorShareOrderQuery,
            meta: {
                title: "服务商分润表单查询",
                keepAlive: false
            }
        },
        {
            path: "/order-query/merchant-problem",
            name: "merchantProblem",
            component: merchantProblem,
            meta: {
                title: "商户问题",
                keepAlive: false
            }
        },
        {
            path: "/order-query/history-work-order-query",
            name: "historyWorkOrderQuery",
            component: historyWorkOrderQuery,
            meta: {
                title: "工单历史查询",
                keepAlive: false
            }
        },
    ]
}