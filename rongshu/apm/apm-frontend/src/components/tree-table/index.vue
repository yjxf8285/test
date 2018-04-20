<style lang="scss">
.tree-table-wrapper {
  width: 100%;
  // height: 100%;
  position: relative;
  &:before,
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  .tree-table-nodes {
    float: left;
    width: 200px;
    overflow: auto;
    .au-bordered {
      border-right: 0px;
    }
    &:before,
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .tree-table-columns {
    position: absolute;
    left: 200px;
    right: 0px;
    &:before,
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .tree-table-hover-row {
    cursor: pointer;
    background-color: #eef1f6;
  }
  .icon-arrow,
  icon-leaf {
    margin-right: 0px;
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    vertical-align: middle;
  }
  .icon-leaf::before {
    content: "";
  }
}
</style>
<template>
  <div class="tree-table-wrapper" ref="tree-table-wrapper">
    <div class="tree-table-nodes" :style="{
      'width': treeNodeColumnWidth.indexOf('%') > -1? treeNodeColumnWidth : ((treeNodeColumnWidth + 2) + 'px')
    }">
      <base-table :bordered="true" :striped="true" ref="treeTableNodes">
        <thead>
          <tr>
            <th
            v-if="column.isTreeNode"
            v-for="(column, index) in columns"
            :key="index">
              {{column.text}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
          v-for="(row, index) in localNodes"
          v-if="row.__show"
          :key="index"
          :class="{
            'tree-table-hover-row': hoverRowIndex === index
          }"
          @mouseover="onHowerRowIn(row, index)"
          @mouseout="onHowerRowOut(row, index)"
          @click="toggleNode(row)"
          >
            <td v-for="(column, index) in columns" :key="index" v-if="column.isTreeNode" :style="{
              paddingLeft: (row.__level * 10) + 'px'
            }">
            <a href="javascript:void(0)">
              <i class="theme-font-icon-color-weak icon-arrow"
                :class="{
                  'ion-arrow-right-b': !row.__expand,
                  'ion-arrow-down-b': row.__expand,
                  'icon-leaf': row.__isleaf
                }"></i><span v-if="$scopedSlots.node === undefined">{{ row[column.value] }}</span>
                <slot v-else name="node" :row="{value:row}"></slot>
            </a>
            </td>
          </tr>
        </tbody>
      </base-table>
    </div>
    <div class="tree-table-columns" :style="{
      'left': treeNodeColumnWidth.indexOf('%') > -1? treeNodeColumnWidth : (treeNodeColumnWidth + 'px')
    }">
      <base-table :bordered="true" :striped="true" ref="treeTableColumns">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index" v-if="!column.isTreeNode">
              {{column.text}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
          v-if="row.__show"
          v-for="(row, index) in localNodes"
          :key="index"
          :class="{
            'tree-table-hover-row': hoverRowIndex === index
          }"
          @mouseover="onHowerRowIn(row, index)"
          @mouseout="onHowerRowOut(row, index)"
          @click="toggleNode(row)"
          >
            <template v-if="$scopedSlots.columns === undefined">
              <td v-for="(column, index) in columns" :key="index" v-if="!column.isTreeNode">
                {{ row[column.value] }}
              </td>
            </template>
            <slot v-else name="columns" :row="{value:row}"></slot>
          </tr>
        </tbody>
      </base-table>
    </div>
  </div>
</template>
<script>
import Table from './table.vue'

export default {
  name: 'tree-table',
  components: { 'base-table': Table },
  data() {
    return {
      rowId: 1,
      hoverRowIndex: -1,
      localNodes: [],
      width: 0,
      nodesWidth: 0,
      columnsWidth: 0
    }
  },
  props: {
    striped: Boolean,
    bordered: Boolean,
    expandAll: {
      type: Boolean,
      default: true
    },
    treeNodeColumnWidth: {
      default: 200
    },
    nodes: {
      type: Array,
      default() {
        return [
          {
            id: 1,
            c1: '根节点1根节点1根节点1根节点1根节点1',
            c2: 'root1',
            children: [
              {
                id: 3,
                c1: '子节点1',
                c2: 'child-1',
                children: [{ id: 3, c1: '子节点1', c2: 'child-1' }]
              }
            ]
          },
          { id: 2, c1: '根节点2', c2: 'root2' }
        ]
      }
    },
    columns: {
      type: Array,
      default() {
        return [
          { text: '树节点', value: 'id' },
          { text: '列1', value: 'c1', isTreeNode: true },
          { text: '列2', value: 'c2' }
        ]
      }
    }
  },
  mounted() {
    // this.computedWidth()
    // window.addEventListener('resize', this.computedWidth, false)
  },
  watch: {
    nodes() {
      let nodes = []
      let resource = JSON.parse(JSON.stringify(this.nodes))
      if (resource && resource.length > 0) {
        resource.forEach(node => {
          nodes = nodes.concat(this.plaintNode(node))
        })
      }
      this.localNodes = nodes
    } /* ,
    width() {
      if(this.treeNodeColumnWidth.indexOf('%')>-1) {
        this.nodesWidth = Math.ceil(this.width * (+this.treeNodeColumnWidth.replace('%','')) / 100)
      }
    } */
  },
  methods: {
    // 拉平节点数据，附加节点属性： __level,__expand,__show,__isleaf
    plaintNode(node) {
      let nodes = []
      node.__id = this.rowId++
      node.__level = node.__level || 1
      node.__expand = this.expandAll
      node.__show = this.expandAll ? true : node.__level === 1
      let children = node.children || []
      if (node.children && node.children.length > 0) {
        node.__isleaf = false
        delete node.children
      } else {
        node.__isleaf = true
      }
      nodes.push(node)
      children.forEach(child => {
        child.__level = node.__level + 1
        child.__expand = this.expandAll
        child.__parent = node
        child.__show = this.expandAll
        nodes = nodes.concat(this.plaintNode(child))
      }, this)
      return nodes
    },
    // 切换节点状态
    toggleNode(node) {
      let vm = this
      let expand = (node.__expand = !node.__expand)
      let show = expand
      vm.localNodes.forEach(item => {
        // 自身更改折叠状态
        // 自身始终处于显示状态
        if (item.__id === node.__id) {
          item.__expand = expand
          item.__show = true
        }
        // 如果节点属于当前节点的子节点，则更改节点显示隐藏状态
        // 如果是展开，则将当前节点的子节点显示。关于子节点的子节点状态由子节点自己决定
        if (item.__parent && item.__parent.__id === node.__id) {
          vm.nodeChildrenVisible(item, show)
        }
      })

      vm.localNodes = [].concat(vm.localNodes)
    },
    /**
      * show:true，则将所有的子项全部显示
      * show:false，则将所有的子项全部隐藏
     */
    nodeChildrenVisible(node, show) {
      let vm = this
      let expand = node.__expand
      vm.localNodes.forEach((n, i) => {
        if (n.__id === node.__id) {
          n.__expand = expand
          n.__show = show
        } else if (n.__parent && n.__parent.__id === node.__id) {
          // 如果展开，则根据
          if (expand) {
            vm.nodeChildrenVisible(n, show)
          }
        }
      })
    },
    onHowerRowIn(row, index) {
      this.hoverRowIndex = index
    },
    onHowerRowOut(row, index) {
      this.hoverRowIndex = -1
    }
    // computedWidth(e) {
    //   let el = this.$refs['tree-table-wrapper']
    //   if(el) {
    //     let computed = window.getComputedStyle(el)
    //     let rect = el.getBoundingClientRect()
    //     let width = el.offsetWidth || rect.width || parseInt(computed.width) || 0
    //     let height = el.offsetHeight || rect.height || parseInt(computed.height) || 0
    //     this.width = width
    //   }
    // },
    // destroyed () {
    //   window.removeEventListener('resize', this.computedWidth)
    // }
  }
}
</script>
