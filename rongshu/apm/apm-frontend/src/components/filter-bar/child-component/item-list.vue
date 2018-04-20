<template>
  <div class="type-list">
    <div class="">
      <el-input
        class="search-box"
        placeholder="按名称搜索"
        size="small"
        v-model.trim="keyWord"
      >
      </el-input>
      <ul class="list-wrap">
        <li class="nodata" v-if="listData.length==0">暂无数据</li>
        <li v-for="(list, index) in listData" v-bind:key="index">
          <el-checkbox v-model="list.checked">{{list.name}}</el-checkbox>
        </li>
      </ul>
    </div>
    <div class="foorter">
      <el-button size="small" @click="hidePopOver">取消</el-button>
      <el-button size="small" @click="confirm" :disabled="btnDisabled">确认</el-button>
      <el-button size="small" @click="reset" :disabled="btnDisabled">重置</el-button>
    </div>
  </div>
</template>
<script>
import { Checkbox, Input, Button } from 'element-ui'
export default {
  components: {
    'el-checkbox': Checkbox,
    'el-input': Input,
    'el-button': Button
  },
  props: {
    itemData: {
      default: {}
    }
  },
  watch: {
    keyWord(v) {
      this.searchList()
    }
  },
  data() {
    return {
      keyWord: '',
      listData: [],
      type: this.itemData.type,
      itemId: this.itemData.itemId,
      infoData: [
        {
          text: '',
          val: 0
        },
        {
          text: '',
          val: 0
        }
      ]
    }
  },
  computed: {
    btnDisabled() {
      if (this.isCheckedData(this.listData).length === 0) {
        return true
      } else {
        return false
      }
    },
    selcetedData() {
      return this.allListData.filter(m => m.checked)
    },
    allListData() {
      let oList = _.cloneDeep(this.itemData.listData)
      oList.map(m => {
        m.checked = false
      })
      return oList
    }
  },
  mounted() {
    this.listData = this.allListData
  },
  methods: {
    searchList() {
      let newList = []
      if (this.keyWord) {
        this.allListData.map(item => {
          if (item.name.search(this.keyWord) >= 0) {
            newList.push(item)
          }
        })
        this.listData = newList
      } else {
        this.listData = this.allListData
      }
    },
    reset() {
      this.listData.map(m => {
        m.checked = false
      })
    },
    isCheckedData() {
      let res = []
      this.allListData.map(m => {
        if (m.checked) {
          m.value = m.id
          m.text = m.name
          res.push(m)
        }
      })
      return res
    },
    confirm() {
      this.$emit('itemConfirm', {
        itemId: this.itemId,
        type: this.type,
        infoData: this.isCheckedData()
      })
      this.hidePopOver()
    },
    hidePopOver() {
      $('body').click()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~vars";

.type-list {
  .con {
    background: #fff;
    display: flex;
    justify-content: space-between;
    .mid-line {
      margin-top: 10px;
      color: #ccc;
    }
    .time-input {
      width: 150px;
    }
  }
  .list-wrap {
    border: $border;
    margin-top: 10px;
    padding: 0 10px 10px 10px;
    overflow-y: auto;
    max-height: 250px;
    .nodata {
      text-align: center;
      color: #ccc;
    }
    li {
      margin-top: 10px;
    }
  }
  .foorter {
    padding-top: 10px;
    text-align: center;
  }
}
</style>
