<template>
  <div class="filter-bar-simple">
    <div class="header clearfix">
      <div class="button-area fn-fl">
        <el-button
          size="mini"
          type="primary"
          class="btn-filter"
          @click="showCon=!showCon">
          <i class="fa fa-filter" aria-hidden="true"></i>
          <span>过滤</span>
        </el-button>
      </div>
      <!--<div class="seach-area fn-fr">-->
        <!--<el-input class="circular" v-model.trim="filterData.keyword" placeholder="请输入内容"-->
                  <!--size="mini"></el-input>-->
      <!--</div>-->
    </div>
    <div class="content" v-show="showCon">
      <div class="row">
        <!--<Checkbox v-model="filterData.checkHaveData">只显示有数据事务</Checkbox>-->
        <!--<Checkbox v-model="filterData.checkTimes">平均响应时间剔除错误响应</Checkbox>-->
        <span class="">响应时间 > </span>
        <input class="s-input"  @keyup="handleAvgResponseTime" v-number-only>
        <span> ms</span>
        <span class="ml40">吞吐率 > </span>
        <input class="s-input" @keyup="handleRpm" v-number-only>
        <span> rpm</span> <span class="ml40">错误数 > </span>
        <input class="s-input" @keyup="handleErrorNum" v-number-only>
        <span> 次</span>
        <!--<span>Tier：</span>-->
        <!--<el-input class="l-input" v-model.trim="filterData.tierName" size="mini" placeholder="请输入内容"></el-input>-->
        <span v-show="contribution">
        <el-switch  class="ml40" v-model="filterData.hideContribution" ></el-switch> <span style="margin-left: 4px;vertical-align: middle"> 隐藏贡献度小于1%的记录</span>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Input, Icon, Switch } from 'element-ui'
export default {
  components: {
    'el-button': Button,
    'el-input': Input,
    Icon,
    'el-switch': Switch
  },
  props: {
    contribution: false
  },
  data() {
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
  mounted() {},
  directives: {
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          el.value = el.value.replace(/[^\-?\d.]/g, '') // 只能输入数字和小数
        }
        el.addEventListener('input', el.handler)
      },
      unbind: function(el) {
        el.removeEventListener('input', el.handler)
      }
    }
  },
  watch: {
    filterData: {
      handler: function(val, oldVal) {
        this.$emit('fbarChange', val, oldVal)
      },
      deep: true
    }
  },
  methods: {
    handleAvgResponseTime(e) {
      this.filterData.avgResponseTime = e.target.value
    },
    handleRpm(e) {
      this.filterData.rpm = e.target.value
    },
    handleErrorNum(e) {
      this.filterData.errorNum = e.target.value
    },
    reset() {
      // this.filterData = {
      //   avgResponseTime: '',
      //   rpm: '',
      //   errorNum: ''
      // }
      $(this.$el).find('.s-input').val('')
      this.filterData.hideContribution = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~vars";

.filter-bar-simple {
  margin: 0px $marginWidth;
  .s-input {
    width: 80px;
    padding: 4px 10px;
  }
  .l-input {
    width: 280px;
  }
  .header {
    padding: 20px 0px 0px 0px;
  }
  .content {
    margin-top: 20px;
    padding: 20px 0px 0px 0px;
    border-top: solid 1px #dcdcdc;
  }

  .circular {
    width: 130px;
    margin-top: 1px;
  }
  .btn-filter {
    //background-color: #2879ff;
    color: #fff;
    padding: 4px 20px;
    border-radius: 2px;
    i {
      margin-right: 2px;
      font-size: 14px;
    }
  }
}
</style>
