/*
* 过滤条 弹窗内容模板 - 时间类型
* @Author: Liuxiaofan
* @Date: 2017-11-01 17:59:39
* @Last Modified by: jiangfeng
* @Last Modified time: 2018-01-08 09:28:22
*/
<template>
  <div class="type-time">
    <div class="con">
      <input size="small" class="time-input" placeholder="ms" v-model.trim="data.infoData[0].text"/>
      <i class="icon ion-minus-round mid-line"></i>
      <input size="small" class="time-input" placeholder="ms" maxlength="8" v-model.trim="data.infoData[1].text"/>
    </div>
    <div class="foorter">
      <el-button size="small" @click="hidePopOver">取消</el-button>
      <el-button size="small" @click="confirm" :disabled="btnDisabled">确认</el-button>
      <el-button size="small" @click="reset" :disabled="btnDisabled">重置</el-button>
    </div>
  </div>
</template>
<script>
import { Input, Button } from 'element-ui'
export default {
  components: {
    'el-input': Input,
    'el-button': Button
  },
  props: {
    itemData: {
      default: {}
    }
  },
  data() {
    return {
      data: {
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
    }
  },
  watch: {
    'data.infoData': {
      handler: function(val, oldVal) {
        val.map(m => {
          m.text = m.text.replace(/[\D]/g, '')
        })
      },
      deep: true
    }
  },
  computed: {
    btnDisabled() {
      let isNoVal = this.data.infoData.some(m => {
        return m.text === ''
      })
      let sTime = Number(this.data.infoData[0].text)
      let eTime = Number(this.data.infoData[1].text)
      let isErrTime = sTime >= eTime
      if (isNoVal || isErrTime) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {},
  methods: {
    reset() {
      this.data.infoData = [
        {
          text: '',
          val: 0
        },
        {
          text: '',
          val: 0
        }
      ]
    },
    confirm() {
      this.$emit('itemConfirm', {
        itemId: this.data.itemId,
        type: 2,
        infoData: [
          {
            text: this.data.infoData[0].text,
            value: Number(this.data.infoData[0].text)
          },
          {
            text: this.data.infoData[1].text,
            value: Number(this.data.infoData[1].text)
          }
        ]
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

.type-time {
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
      height: 28px;
      padding: 0 10px;
    }
  }
  .list-wrap {
    border: $border;
    margin-top: 10px;
    padding: 0 10px 10px 10px;
    overflow-y: auto;
    max-height: 250px;
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
