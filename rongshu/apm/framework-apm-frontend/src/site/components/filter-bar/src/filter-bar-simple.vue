<template>
  <div class="filter-bar-simple">
    <div class="header clearfix">
      <div class="button-area fn-fl">
        <au-button type="primary" class="btn-filter" @click="showCon=!showCon">
          <au-icon type="filter"></au-icon>
         <span>过滤</span>
        </au-button>
      </div>
      <!--<div class="seach-area fn-fr">-->
        <!--<el-input class="circular" v-model.trim="filterData.keyword" placeholder="请输入内容"-->
                  <!--size="mini"></el-input>-->
      <!--</div>-->
    </div>
    <div class="content" v-show="showCon">
      <div class="row">
        <span v-show="contribution">
        <au-switch   v-model="filterData.hideContribution" label="隐藏贡献度小于1%的记录"></au-switch>
          </span>
        <!--<Checkbox v-model="filterData.checkHaveData">只显示有数据事务</Checkbox>-->
        <!--<Checkbox v-model="filterData.checkTimes">平均响应时间剔除错误响应</Checkbox>-->
        <span class="ml40">响应时间 > </span>
        <input class="s-input"  @keyup="handleAvgResponseTime" v-number-only>
        <span> ms</span>
        <span class="ml40">吞吐率 > </span>
        <input class="s-input" @keyup="handleRpm" v-number-only>
        <span> rpm</span> <span class="ml40">错误数 > </span>
        <input class="s-input" @keyup="handleErrorNum" v-number-only>
        <span> 次</span>
        <!--<span>Tier：</span>-->
        <!--<el-input class="l-input" v-model.trim="filterData.tierName" size="mini" placeholder="请输入内容"></el-input>-->

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contribution: false
  },
  data () {
    return {
      showCon: false,
      filterData: {
        hideContribution: false,
        avgResponseTime: '',
        rpm: '',
        errorNum: ''
      }
    }
  },
  mounted () {},
  directives: {
    numberOnly: {
      bind: function (el) {
        el.handler = function () {
          el.value = el.value.replace(/[^\-?\d.]/g, '') // 只能输入数字和小数
        }
        el.addEventListener('input', el.handler)
      },
      unbind: function (el) {
        el.removeEventListener('input', el.handler)
      }
    }
  },
  watch: {
    filterData: {
      handler: function (val, oldVal) {
        this.$emit('fbarChange', val, oldVal)
      },
      deep: true
    }
  },
  methods: {
    handleAvgResponseTime (e) {
      this.filterData.avgResponseTime = e.target.value
    },
    handleRpm (e) {
      this.filterData.rpm = e.target.value
    },
    handleErrorNum (e) {
      this.filterData.errorNum = e.target.value
    },
    reset () {
      let inputsEl = window.document.querySelectorAll('.s-input')
      for (let i = 0; i < inputsEl.length; i++) {
        inputsEl[i].value = ''
      }
      this.filterData.hideContribution = false
    }
  }
}
</script>

<style lang="scss" scoped>
  $marginWidth: 24px;
.filter-bar-simple {
  margin: 0 $marginWidth;
  .ml40 {
    margin-left: 40px;
  }
  .s-input {
    width: 80px;
    padding: 4px 10px;
  }
  .l-input {
    width: 280px;
  }
  .header {
    padding: 20px 0 0 0;
  }
  .content {
    margin-top: 20px;
    padding: 20px 0 0 0;
    border-top: solid 1px #dcdcdc;
    font-size: 13px;
  }
  .circular {
    width: 130px;
    margin-top: 1px;
  }
  .btn-filter {
    color: #fff;
    padding: 0 20px;
  }
}
</style>
