<template>
  <div class="type-list">
    <div class="">
      <au-input
        class="search-box"
        placeholder="按名称搜索"
        v-model.trim="keyWord"
      >
      </au-input>
      <ul class="list-wrap">
        <li class="nodata" v-if="listData.length==0">暂无数据</li>
        <li v-for="(list, index) in listData" v-bind:key="index">
          <au-checkbox v-model="list.checked" :text="list.name"></au-checkbox>
        </li>
      </ul>
    </div>
    <div class="foorter">
      <au-button size="small" @click="hidePopOver">取消</au-button>
      <au-button size="small" type="primary" @click="confirm" :disabled="btnDisabled">确认</au-button>
      <au-button size="small" @click="reset" :disabled="btnDisabled">重置</au-button>
    </div>
  </div>
</template>
<script>
const _ = require('lodash')
export default {
  components: {
  },
  props: {
    itemData: {
      default: {}
    }
  },
  watch: {
    keyWord (v) {
      this.searchList()
    }
  },
  data () {
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
    btnDisabled () {
      if (this.isCheckedData(this.listData).length === 0) {
        return true
      } else {
        return false
      }
    },
    selcetedData () {
      return this.allListData.filter(m => m.checked)
    },
    allListData () {
      let oList = _.cloneDeep(this.itemData.listData)
      oList.map(m => {
        m.checked = false
      })
      return oList
    }
  },
  mounted () {
    this.listData = this.allListData
  },
  methods: {
    searchList () {
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
    reset () {
      this.listData.map(m => {
        m.checked = false
      })
    },
    isCheckedData () {
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
    confirm () {
      this.$emit('itemConfirm', {
        itemId: this.itemId,
        type: this.type,
        infoData: this.isCheckedData()
      })
      this.hidePopOver()
    },
    hidePopOver () {
      window.document.body.click()
    }
  }
}
</script>
<style lang="scss" scoped>
  $border: solid 1px #e1e1e1;
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
