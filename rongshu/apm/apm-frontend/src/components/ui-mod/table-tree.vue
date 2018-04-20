<style lang="scss" >
.table-tree {
  max-height: 350px;
  overflow-y: auto;
  th {
    border: 1px solid rgb(223, 233, 236);
    background: rgb(238, 243, 246);
    height: 40px;
    padding: 0 18px;
  }
  td {
    padding: 20px;
    border: 1px solid rgb(223, 233, 236);
  }
  li {
    line-height: 36px;
    height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree {
    border: none;
  }
  .el-tree-node__content {
    cursor: inherit;
  }
  .el-tree-node__content:hover {
    background: none;
  }
  .el-tree-node__label {
    max-width: 700px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree-node__label:before {
    content: " ";
    float: left;
    margin-top: 14px;
    margin-right: 5px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #97a8be;
  }
  .el-tree-node__expand-icon {
    display: none;
  }
}
</style>
<template>
  <div class="table-tree">
    <table class="mt20" width="100%">
      <thead>
      <tr>
        <th width="50%">方法名</th>
        <th width="25%">执行时间(ms)</th>
        <th width="25%">实例名</th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="(data,index) in processedData" :key="index">
        <td>
          <el-tree
            :data="data.trees"
            :default-expand-all="true"
            :expand-on-click-node="false"
          ></el-tree>
        </td>
        <td>
          <ul>
            <li v-for="(v,i) in data.values" :key="i">{{v}}</li>
          </ul>
        </td>
        <td>
          <ul>
            <li v-for="(v,i) in data.names" :key="i">{{v}}</li>
          </ul>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
export default {
  components: {
    'el-tree': Tree
  },
  props: {
    datas: {
      type: Array,
      required: true
    }
  },
  watch: {
    datas: {
      deep: true,
      handler(v) {
        this.formatData(v)
      }
    }
  },
  data() {
    return {
      processedData: []
    }
  },
  mounted() {},
  methods: {
    toLinearData(arr) {
      let newData = arr || []
      let timeArr = []
      let nameArr = []
      let recursion = function(arr) {
        arr.map(m => {
          timeArr.push(m.value)
          nameArr.push(m.agentName)
          recursion(m.child)
        })
      }
      recursion(newData)
      newData.timeArr = timeArr
      newData.nameArr = nameArr
      return newData
    },
    keyRename(arr) {
      let newData = arr || []
      let recursion = function(arr) {
        arr.map(m => {
          m.label = m.name
          m.children = m.child
          recursion(m.child)
        })
      }
      recursion(newData)
      return newData
    },
    formatData(v) {
      let pData = []
      v.map((m, i) => {
        let treeArr = this.keyRename([m])
        let linearArr = this.toLinearData([m])
        pData.push({
          trees: treeArr,
          values: linearArr.timeArr,
          names: linearArr.nameArr
        })
      })
      this.processedData = pData
    }
  }
}
</script>

