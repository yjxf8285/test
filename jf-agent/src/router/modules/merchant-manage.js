/*
 * @Author: wuyulong
 * @Date: 2019-12-19 17:40:09
 * @LastEditTime: 2020-02-21 15:44:45
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/router/modules/merchant-management.js
 */
const selfModify = () => import('@/views/merchant-manage/self-modify/self-modify.vue')
const merchantAptitudeSupplement = () => import('@/views/merchant-manage/merchant-aptitude-supplement/merchant-aptitude-supplement.vue')
const merchantQuery = () => import('@/views/merchant-manage/merchant-query/merchant-query.vue')
const newSmallMerchant = () => import('@/views/merchant-manage/new-small-merchant/new-small-merchant.vue')
const newCompanyMerchant = () => import('@/views/merchant-manage/new-company-merchant/new-company-merchant.vue')
const merchantBindMachineApply = () => import('@/views/merchant-manage/merchant-bind-machine-apply/merchant-bind-machine-apply.vue')
const insuranceratesNet = () => import('@/views/merchant-manage/insurancerates-net/insurancerates-net.vue')
const md_24hours = () => import('@/views/merchant-manage/md-24hours/md-24hours.vue')
const basicInformationModify = () => import('@/views/merchant-manage/basic-information-modify/basic-information-modify.vue')
const merchantNetworkChange = () => import('@/views/merchant-manage/merchant-network-change/merchant-network-change.vue')
const merchantBatchChange = () => import('@/views/merchant-manage/merchant-batch-change/merchant-batch-change.vue')
const merchantGoodsQuery = () => import('@/views/merchant-manage/merchant-goods-query/merchant-goods-query.vue')
const specialMerchant = () => import('@/views/merchant-manage/special-merchant/special-merchant.vue')
const merchantKeyQuery = () => import('@/views/merchant-manage/merchant-key-query/merchant-key-query.vue')
const deleteMerchant = () => import('@/views/merchant-manage/delete-merchant/delete-merchant.vue')
const merchantBillingInfoChange = () => import('@/views/merchant-manage/merchant-billing-info-change/merchant-billing-info-change.vue')
const rateChangeApply = () => import('@/views/merchant-manage/rate-change-apply/rate-change-apply.vue')
const merchantPreOpen = () => import('@/views/merchant-manage/merchant-pre-open/merchant-pre-open.vue')
const merchantVipApply = () => import('@/views/merchant-manage/merchant-vip-apply/merchant-vip-apply.vue')
const merchantTransfer = () => import('@/views/merchant-manage/merchant-transfer/merchant-transfer.vue')
const merchantInfoChange = () => import('@/views/merchant-manage/merchant-info-change/merchant-info-change.vue')
const merchantQueryDetail = () => import('@/views/merchant-manage/merchant-query/merchant-query-detail/merchant-query-detail.vue')

import Layout from '@/layout'

export default {
  path: '/merchant-management',
  component: Layout,
  redirect: '/merchant-management/merchantAptitudeSupplement',
  name: 'merchant-management',
  meta: {
    title: '商户管理',
    icon: 'peoples'
  },
  children: [
    {
      path: '/merchant-management/merchantAptitudeSupplement',
      name: 'merchantAptitudeSupplement',
      component: merchantAptitudeSupplement,
      meta: {
        title: '商户资质补充',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-query',
      name: 'merchant-query',
      component: merchantQuery,
      meta: {
        title: '商户查询',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-query/merchant-query-detail',
      name: 'merchant-query-detail',
      component: merchantQueryDetail,
      meta: {
        title: '商户详情',
        keepAlive: false
      },
      hidden: true
    },
    {
      path: '/merchant-management/insurancerates-net',
      name: 'insuranceratesNet',
      component: insuranceratesNet,
      meta: {
        title: '保险费率商户入网',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/new-small-merchant',
      name: 'newSmallMerchant',
      component: newSmallMerchant,
      meta: {
        title: '新增小微商户',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/new-company-merchant',
      name: 'newCompanyMerchant',
      component: newCompanyMerchant,
      meta: {
        title: '新增企业商户',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-bind-machine-apply',
      name: 'merchantBindMachineApply',
      component: merchantBindMachineApply,
      meta: {
        title: '商户增机申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/basic-information-modify',
      name: 'basicInformationModify',
      component: basicInformationModify,
      meta: {
        title: '基本信息变更申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-network-change',
      name: 'merchantNetworkChange',
      component: merchantNetworkChange,
      meta: {
        title: '商户网点信息变更申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-key-query',
      name: 'merchantKeyQuery',
      component: merchantKeyQuery,
      meta: {
        title: '商户密钥查询',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/delete-merchant',
      name: 'deleteMerchant',
      component: deleteMerchant,
      meta: {
        title: '删除商户',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-billing-info-change',
      name: 'merchantBillingInfoChange',
      component: merchantBillingInfoChange,
      meta: {
        title: '商户结算信息变更',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/rate-change-apply',
      name: 'rateChangeApply',
      component: rateChangeApply,
      meta: {
        title: '费率变更申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-pre-open',
      name: 'merchantPreOpen',
      component: merchantPreOpen,
      meta: {
        title: '商户预授权开通申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-vip-apply',
      name: 'merchantVipApply',
      component: merchantVipApply,
      meta: {
        title: '商户VIP申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-info-change',
      name: 'merchantInfoChange',
      component: merchantInfoChange,
      meta: {
        title: '商户信息变更申请',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-transfer',
      name: 'merchantTransfer',
      component: merchantTransfer,
      meta: {
        title: '商户转移',
        keepAlive: false
      }
    },
    {

      path: '/merchant-management/special-merchant',
      name: 'specialMerchant',
      component: specialMerchant,
      meta: {
        title: '特惠商户',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-goods-query',
      name: 'merchant-goods-querye',
      component: merchantGoodsQuery,
      meta: {
        title: '商户产品查询',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/merchant-batch-change',
      name: 'merchant-batch-change',
      component: merchantBatchChange,
      meta: {
        title: '商户产品批量变更',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/md-24hours',
      name: 'md_24hours',
      component: md_24hours,
      meta: {
        title: '24小时秒到审核',
        keepAlive: false
      }
    },
    {
      path: '/merchant-management/self-modify',
      name: 'selfModify',
      component: selfModify,
      meta: {
        title: '自助整改',
        keepAlive: false
      }
    }
  ]
}
