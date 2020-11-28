/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime : 2020-01-07 16:41:43
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/system-manage/operator-manage/operator-manage.js
 */
export default {
  data() {
    return {
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
      }, {
        id: 10,
        label: 'POS收单平台2'
      }],
      activeName: '0',
      isExpand: false
    }
  },
  methods: {
    tabClick(tab) {
      if (tab.index == '0') {
        // 将没有转换成树的原数据
        const treeList = this.menuList
        for (let i = 0; i < treeList.length; i++) {
          // 将没有转换成树的原数据设置key为... 的展开
          this.$refs.selectTree.store.nodesMap[treeList[i].id].expanded = true
        }
      } else {
        // 将没有转换成树的原数据
        const treeList = this.menuList
        for (let i = 0; i < treeList.length; i++) {
          // 将没有转换成树的原数据设置key为... 的展开
          this.$refs.selectTree.store.nodesMap[treeList[i].id].expanded = false
        }
      }
    }
  }
}
