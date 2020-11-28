/*
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:38
 * @LastEditTime: 2020-05-11 10:09:20
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/router/modules/common-setting.js
 */
let feedBack_page = () => import('@/views/common-setting/feed-back/feed-back.vue');
let modify_password = () => import('@/views/common-setting/modify-password/modify-password.vue');
let data_download = () => import('@/views/common-setting/data-download/data-download.vue');
let export_apply_query = () => import('@/views/common-setting/export-apply-query/export-apply-query.vue');
let system_notice = () => import('@/views/common-setting/system-notice/system-notice.vue');
let use_help = () => import('@/views/common-setting/use-help/use-help.vue');
let login_daily_record  = () => import('@/views/common-setting/login-daily-record/login-daily-record.vue');



import Layout from '@/layout';

export default {
    path: '/common-setting',
    component: Layout,
    redirect: '/common-setting/feed-back',
    name: 'common-setting',
    meta: {
        title: '设置',
        icon: 'tree-table'
    },
    children:[
        {
            path: "/common-setting/feed-back",
            name: "feedBack_page",
            component: feedBack_page,
            meta: {
                title: "意见反馈",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/use-help",
            name: "use-help",
            component: use_help,
            meta: {
                title: "常见问题",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/data-download",
            name: "data-download",
            component: data_download,
            meta: {
                title: "资料下载",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/export-apply-query",
            name: "export-apply-query",
            component: export_apply_query,
            meta: {
                title: "导出申请查询",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/system-notice",
            name: "system-notice",
            component: system_notice,
            meta: {
                title: "系统公告",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/login-daily-record",
            name: "login-daily-record",
            component: login_daily_record,
            meta: {
                title: "登陆日志",
                keepAlive: false
            }
        },
        {
            path: "/common-setting/modify-password",
            name: "modify-password",
            component: modify_password,
            meta: {
                title: "修改密码",
                keepAlive: false
            }
        },
        
    ]
}