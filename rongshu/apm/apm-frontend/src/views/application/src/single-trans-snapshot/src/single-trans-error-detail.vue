<style lang="scss" scoped>
.single-trans-error-detail {
  .multiple {
    border-bottom: 1px solid #dcdcdc;
    display: flex;
    .l {
      padding-top: 15px;
      width: 400px;
      .content {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;
        ul {
          list-style: none;
          padding: 0px;
          li {
            font-size: 14px;
            line-height: 40px;
            margin-bottom: 14px;
            padding-left: 10px;
            border-radius: 5px;
            display: block;
            background: #f7f7f7;
            color: #666;
            &:hover,
            &.selected {
              background: #e9f1ff;
              cursor: pointer;
            }
          }
        }
      }
    }
    .r {
      flex: 1;
      border-left: solid 1px #dcdcdc;
      padding-top: 15px;
      .content {
        margin-bottom: 0px;
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 600px;
        line-height: 22px;
      }
    }
  }
}
.error-empty {
  width: 100%;
  min-height: 800px;
  margin-top: 10px;
  display: inline-block;
  border: 0px solid #e6ebf5;
  text-align: center;
  vertical-align: middle;
  line-height: 100px;
}
</style>
<template>
<div class="single-trans-error-detail common-container no-border" ref="loadingContainer">
    <li class="error-empty" v-if="errorList && errorList.length <= 0">暂无数据</li>
    <div class="multiple" v-else>
      <div class="l">
        <div class="header-title tabstyle">
          <span class="title-name">错误列表</span>
        </div>
        <div class="content">
          <ul class="panel">
            <li
              v-for="(item, index) in errorList"
              :key="index"
              :class="selectedError === item?['selected']:''"
              @click="selectedError=item">
              {{item.name}}
              <i class="theme-font-icon-color-weak ion-chevron-right" style="float: right; margin-top: 12px; margin-right: 10px;"></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="r">
       <div class="header-title tabstyle">
          <span class="title-name">堆栈追踪</span>
        </div>
        <div class="content" ref="topoContainer">
          {{selectedError.stack}}
        </div>
      </div>
  </div>
</div>
</template>

<script>
import loadingMixin from '_components/mixin/loading.js'
import TabMixin from '_components/mixin/snapshot-tab.js'
import { Table, TableColumn } from 'element-ui'
export default {
  mixins: [loadingMixin, TabMixin],
  data() {
    return {
      errorList: [],
      selectedError: {}
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  methods: {
    reload() {
      this.getErrorList()
    },
    /**
     * 获取当前事务的错误列表
     */
    getErrorList() {
      let that = this
      that.loading = true
      that.api.getSingleTransErrorList({
        data: {
          condition: that.options
        },
        success(res) {
          if (res.code !== 0) return
          that.errorList = res.data || []
        },
        complete() {
          that.loading = false
        }
      })
    }
  }
}
</script>

