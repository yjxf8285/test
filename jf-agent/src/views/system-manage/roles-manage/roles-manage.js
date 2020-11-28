/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-07 14:46:33
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/system-manage/operator-manage/operator-manage.js
 */
export default {
  data() {
    return {
      roleName: '',
      roleTips: '',
      rolesList: [{
        roleName: '资料管理',
        roleState: '可用'
      }, {
        roleName: '乐付宝产品查询',
        roleState: '可用'
      }, {
        roleName: '付宝产品分润查询',
        roleState: '可用'
      }, {
        roleName: '资料管理',
        roleState: '可用'
      }],
      dialogVisible: false,
      chooseMenuVisible: false,
      roleState: '',
      menuList: [{
        id: 1,
        label: 'POS收单平台',
        children: [{
          id: 2,
          label: '开刷管理',
          children: [{
            id: 3,
            label: '刷活动订单查询'
          }, {
            id: 3,
            label: 'i刷推荐商户查询'
          }]
        }, {
          id: 2,
          label: '资料管理'
        }, {
          id: 2,
          label: '风险管理'
        }, {
          id: 2,
          label: '单据查询'
        }, {
          id: 2,
          label: '开刷管理',
          children: [{
            id: 3,
            label: '刷活动订单查询'
          }, {
            id: 3,
            label: 'i刷推荐商户查询'
          }]
        }, {
          id: 2,
          label: '资料管理'
        }, {
          id: 2,
          label: '风险管理'
        }, {
          id: 2,
          label: '单据查询'
        }, {
          id: 2,
          label: '开刷管理',
          children: [{
            id: 3,
            label: '刷活动订单查询'
          }, {
            id: 3,
            label: 'i刷推荐商户查询'
          }]
        }, {
          id: 2,
          label: '资料管理'
        }, {
          id: 2,
          label: '风险管理'
        }, {
          id: 2,
          label: '单据查询'
        }]
      }],
      activeName: '0',
      modify_roleTips: '',
      modify_roleName: '',
      modify_roleState: ''
    }
  },
  methods: {
    addRoles() {
      this.dialogVisible = true
    },
    chooseMenu() {
      this.chooseMenuVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleClose2() {
      this.chooseMenuVisible = false
    },
    tabClick(tab) {
      this.activeName = tab.index
    }
  }
}
