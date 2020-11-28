/*
 * @Author: wuyulong
 * @Date: 2020-02-11 16:36:44
 * @LastEditTime: 2020-02-19 20:28:55
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/account-management.js
 */
import Layout from '@/layout';

let myLfAccount = () => import("@/views/account-manage/my-lf-account/my-lf-account.vue");
let myOtherAccount = () => import("@/views/account-manage/my-other-account/my-other-account.vue");
let myDebitCard = () => import("@/views/account-manage/my-debit-card/my-debit-card.vue");
let lfAccountDetailQuery = () => import("@/views/account-manage/lf-account-detail-query/lf-account-detail-query.vue");
let otherAccountDetailQuery = () => import("@/views/account-manage/other-account-detail-query/other-account-detail-query.vue");

export default {
    path: '/account-management',
    component: Layout,
    redirect: 'noRedirect',
    name: 'account-management',
    meta: {
        title: '账户管理',
        icon: 'shopping'
    },
    children: [
        {
            path: "/account-management/my-lf-account",
            name: "myLfAccount",
            component: myLfAccount,
            meta: {
                title: "我的乐富账户",
                keepAlive: false
            }
        },
        {
            path: "/account-management/my-other-account",
            name: "myOtherAccount",
            component: myOtherAccount,
            meta: {
                title: "我的其他账户",
                keepAlive: false
            }
        },
        {
            path: "/account-management/my-debit-card",
            name: "myDebitCard",
            component: myDebitCard,
            meta: {
                title: "我的结算卡",
                keepAlive: false
            }
        },
        {
            path: "/account-management/lf-account-detail-query",
            name: "lfAccountDetailQuery",
            component: lfAccountDetailQuery,
            meta: {
                title: "乐富账户明细查询",
                keepAlive: false
            }
        },
        {
            path: "/account-management/other-account-detail-query",
            name: "otherAccountDetailQuery",
            component: otherAccountDetailQuery,
            meta: {
                title: "其它账户明细查询",
                keepAlive: false
            }
        }
    ]
}