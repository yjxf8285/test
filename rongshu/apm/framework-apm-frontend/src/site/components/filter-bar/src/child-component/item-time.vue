<template>
  <div class="type-time">
    <div class="con">
      <input size="small" class="time-input" placeholder="ms" v-model.trim="data.infoData[0].text"/>
      <i class="icon ion-minus-round mid-line"> - </i>
      <input size="small" class="time-input" placeholder="ms" maxlength="8" v-model.trim="data.infoData[1].text"/>
    </div>
    <div class="foorter">
      <au-button size="small" @click="hidePopOver">取消</au-button>
      <au-button size="small" type="primary" @click="confirm" :disabled="btnDisabled">确认</au-button>
      <au-button size="small" @click="reset" :disabled="btnDisabled">重置</au-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    itemData: {
      default: {}
    }
  },
  data () {
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
      handler: function (val, oldVal) {
        val.map(m => {
          m.text = m.text.replace(/[\D]/g, '')
        })
      },
      deep: true
    }
  },
  computed: {
    btnDisabled () {
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
  mounted () {},
  methods: {
    reset () {
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
    confirm () {
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
    hidePopOver () {
      window.document.body.click()
    }
  }
}
</script>
<style lang="scss" scoped>
  $border: solid 1px #e1e1e1;
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
