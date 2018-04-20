<template>
  <div class="filter-bar-complex">
    <au-popover class="hackpopper-fitler-list menu" ref="filterMenuPopover" trigger="click" placement="bottom left" :hide-on-blur="true" :triangle="false"  :plain="true">
      <au-button slot="target" type="primary" :loading="btnLoading">  <au-icon type="filter"></au-icon> 添加筛选</au-button>
      <div slot="content">
        <ul class="fitler-list">
          <li :class="{'disabled':m.disabled}" v-bind:key="index" v-for="(m, index) in menuList" @click="selectFL(m)">{{m.text}}</li>
        </ul>
      </div>
    </au-popover>
    <div class="content" v-show="showCon">
      <div :class="'item '+item.itemId" :key="item.itemId" :ref="'item'" v-for="item in itemList">
        <au-popover
          :plain="true"
          :key="item.itemId"
          :class="'hackpopper-fitler-list'+' '+item.itemId"
          :triangle="false"
          placement="bottom left"
          trigger="click"
          :hide-on-blur="true"
          @show="itemPopoverShow"
          @hide="itemPopoverHide"
        >
          <div slot="target">
             <span :class="'item-trigger-area '+item.itemId" slot="reference" :key="item.itemId">
            <span class="title">{{item.name}}:</span>
            <span class="total-count" v-if="item.type==1">({{item.infos.length}})</span>
            <span class="info mr10">
                <span v-for="(info,i) in item.infos" v-bind:key="i">
                  {{info.text}}
                 <span v-if="(i+1)<item.infos.length"> {{item.type === 1 ? ',' : '-'}} </span>
                </span>
            </span>
                <i class="icon ion-close"  @click="delItem(item)">x</i>
          </span>
          </div>
          <div slot="content" class="item-tip-content">
            <ItemList v-if="item.type==1" @itemConfirm="itemConfirm" :itemData="item"></ItemList>
            <ItemTime @itemConfirm="itemConfirm" :itemData="item" v-if="item.type==2"></ItemTime>
          </div>
        </au-popover>

      </div>
    </div>
  </div>
</template>

<script>
import ItemTime from './child-component/item-time.vue'
import ItemList from './child-component/item-list.vue'
export default {
  name: 'FilterBarComplex',
  components: {
    ItemList,
    ItemTime
  },
  props: {
    filterList: {
      default: [
        // 入参示例
        // {
        //   text: '事务情况',
        //   disabled: false,
        //   type: 1, // 1:多选框, 2:时间范围
        //   itemId: 1,
        //   listData: [
        //     {
        //       name: '正常',
        //       id: 'NORMAL'
        //     },
        //     {
        //       name: '缓慢',
        //       id: 'SLOW'
        //     },
        //     {
        //       name: '非常慢',
        //       id: 'VERY_SLOW'
        //     },
        //     {
        //       name: '错误',
        //       id: 'ERROR'
        //     }
        //   ]
        // }
      ]
    }
  },
  data () {
    return {
      btnLoading: true,
      menuList: [],
      // 只做展示
      itemList: [],
      // 用来组织与后端交互的数据
      filterData: []
    }
  },
  watch: {
    // 入口数据
    filterList: {
      handler: function (val, oldVal) {
        if (val.length > 0) {
          this.btnLoading = false
          // 解决数据更新后disabled状态丢失的bug
          if (this.menuList.length > 0) {
            val.map((m, i) => {
              m.disabled = this.menuList[i].disabled
            })
          }
          this.menuList = val
        }
      },
      deep: true
    },
    // 出口数据
    filterData: {
      handler: function (val, oldVal) {
        this.$emit('change', val, oldVal)
      },
      deep: false // 如果是深度监听会出现bug，那个子组件的cheakbox状态更新会触发change
    }
  },
  computed: {
    showCon () {
      return this.itemList.length > 0
    }
  },
  mounted () {},
  methods: {
    selectFL (m) {
      if (m.disabled === true) return
      m.disabled = true
      this.$refs.filterMenuPopover.hide()
      this.createItem(m)
      // this.trigerItemClick()
    },
    trigerItemClick () {
      this.$nextTick(() => {
        // let itemDoms = this.$refs.item
        // let lastItem = itemDoms[itemDoms.length - 1]
        // $(lastItem)
        //   .find('.item-trigger-area')
        //   .click()
      })
    },
    disabledList (itemId) {
      this.menuList.map(m => {
        if (m.itemId === itemId) {
          m.disabled = true
        }
      })
    },
    ableList (itemId) {
      if (itemId) {
        this.menuList.map(m => {
          if (m.itemId === itemId) {
            m.disabled = false
          }
        })
      } else {
        this.menuList.map(m => {
          m.disabled = false
        })
      }
    },
    itemConfirm (itemData) {
      switch (itemData.type) {
        case 2:
          this.itemList.map(m => {
            if (m.itemId === itemData.itemId) {
              m.infos = [
                {
                  text: itemData.infoData[0].text + 'ms'
                },
                {
                  text: itemData.infoData[1].text + 'ms'
                }
              ]
            }
          })
          this.filterDataPush(itemData)
          break
        case 1:
          this.itemList.map(m => {
            if (m.itemId === itemData.itemId) {
              m.infos = itemData.infoData
            }
          })
          this.filterDataPush(itemData)
          break
      }
    },
    filterDataPush (itemData) {
      let isHad = this.filterData.some(m => m.itemId === itemData.itemId)
      if (isHad) {
        this.filterData.forEach(m => {
          if (m.itemId === itemData.itemId) {
            m.infoData = itemData.infoData
          }
        })
      } else {
        this.filterData.push(itemData)
      }
      this.$emit('change', this.filterData)
    },
    createItem (item) {
      this.itemList.push({
        type: item.type,
        name: item.text,
        itemId: item.itemId,
        infos: [],
        infoData: [],
        listData: item.listData
      })
    },
    delItem (item) {
      let res = []
      this.itemList.map(m => {
        if (m.itemId !== item.itemId) {
          m.infoData = m.infos
          res.push(m)
        }
      })
      this.ableList(item.itemId)
      this.itemList = res
      this.filterData = res
    },
    itemPopoverHide () {
      let newItemlist = []
      this.itemList.map(m => {
        if (m.infos.length !== 0) {
          newItemlist.push(m)
        } else {
          this.ableList(m.itemId)
        }
      })
      this.itemList = newItemlist
    },
    itemPopoverShow () {
    },
    resetAll () {
      this.itemList = []
      this.filterData = []
      this.ableList()
    }
  }
}
</script>

<style lang="scss" scoped>
  $marginWidth: 20px;
.item-tip-content {
  padding: 10px;
}

.fitler-list {
  li {
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: #2879ff;
      color: #fff;
    }
    &.disabled {
      color: #ccc;
    }
  }
}
$marginWidth: 24px;
.filter-bar-complex {
  margin: 0 $marginWidth;
  .header {
    padding: $marginWidth;
    padding-bottom: 0;
  }

  .content {
    padding: 2px 10px 10px 10px;
    .item {
      font-size: 12px;
      margin: 8px 10px 0 0;
      cursor: pointer;
      display: inline-block;
      padding: 0 14px;
      border-radius: 30px;
      height: 28px;
      line-height: 28px;
      color: #fff;
      background: #7a879d;
      .item-trigger-area {
        height: 28px;
        line-height: 28px;
        display: inline-block;
      }
      .info {
        vertical-align: middle;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
      }
    }
  }
  .content,
  .footer {
    padding-left: $marginWidth;
  }
  .filter-btn {
    border-radius: 3px;
    padding: 5px 10px;
  }
}
</style>
