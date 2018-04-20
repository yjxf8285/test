<style lang="scss" scope>

</style>
<template>
  <div class="web-affair">
    <top-bar :title="title" @barChange="barChange"></top-bar>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{pageLoadData.title}}</span>
      </div>
      <cm-lines
        :loading="pageLoadData.loading"
        :data="pageLoadData.data"
        :title="pageLoadData.title"
        :lazy="pageLoadData.lazy"
        @lazy-load="getWebPageLoad"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{apdexData.title}}</span>
      </div>
      <cm-lines
        :loading="apdexData.loading"
        :data="apdexData.data"
        :title="apdexData.title"
        :lazy="apdexData.lazy"
        @lazy-load="getWebApdex"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{browserData.title}}</span>
      </div>
      <cm-lines
        :loading="browserData.loading"
        :data="browserData.data"
        :title="browserData.title"
        :lazy="browserData.lazy"
        @lazy-load="getWebBrowser"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{basePv.title}}</span>
      </div>
      <cm-lines
        :loading="basePv.loading"
        :data="basePv.data"
        :title="basePv.title"
        :lazy="basePv.lazy"
        @lazy-load="getWebBasepv"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{top5pv.title}}</span>
      </div>
      <cm-lines
        :loading="top5pv.loading"
        :data="top5pv.data"
        :title="top5pv.title"
        :lazy="top5pv.lazy"
        @lazy-load="getWebTop5pv"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{top5TimeSpend.title}}</span>
      </div>
      <cm-lines
        :loading="top5TimeSpend.loading"
        :data="top5TimeSpend.data"
        :title="top5TimeSpend.title"
        :lazy="top5TimeSpend.lazy"
        @lazy-load="getWebTop5TimeSpend"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{ajaxPv.title}}</span>
      </div>
      <cm-lines
        :loading="ajaxPv.loading"
        :data="ajaxPv.data"
        :title="ajaxPv.title"
        :lazy="ajaxPv.lazy"
        @lazy-load="getWebAjaxPv"
      ></cm-lines>
    </div>
    <div class="common-container">
      <div class="header-title">
        <span class="title-name">{{ajaxTime.title}}</span>
      </div>
      <cm-lines
        :loading="ajaxTime.loading"
        :data="ajaxTime.data"
        :title="ajaxTime.title"
        :lazy="ajaxTime.lazy"
        @lazy-load="getWebAjaxTime"
      ></cm-lines>
    </div>

  </div>
</template>
<script>
import topBarQuery from '../../../../components/mixin/topBarQuery'
export default {
  data() {
    return {
      title: '浏览器',
      pageLoadData: {
        loading: false,
        title: '页面加载分析',
        lazy: true,
        data: {}
      },
      apdexData: {
        loading: false,
        title: '用户满意度分析',
        lazy: true,
        data: {}
      },
      browserData: {
        loading: false,
        title: '浏览器分析',
        lazy: true,
        data: {}
      },
      basePv: {
        loading: false,
        title: '访问量',
        lazy: true,
        data: {}
      },
      top5pv: {
        loading: false,
        title: 'top5访问量',
        lazy: true,
        data: {}
      },
      top5TimeSpend: {
        loading: false,
        title: 'top5耗时',
        lazy: true,
        data: {}
      },
      ajaxPv: {
        loading: false,
        title: 'ajax数量',
        lazy: true,
        data: {}
      },
      ajaxTime: {
        loading: false,
        title: 'ajax时间',
        lazy: true,
        data: {}
      },
      queryData: {
        interval: '',
        systemId: '',
        groupId: '',
        agentId: ''
      }
    }
  },
  components: {
    'cm-lines': require('_charts/chart-lines.vue')
  },
  mixins: [topBarQuery],
  mounted: function() {},
  computed: {},
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.queryData = {
        appId: this.appId,
        aggrInterval: this.aggrInterval,
        interval: this.interval,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.getData()
    },
    getData() {
    },
    getWebPageLoad() {
      let vm = this
      let query = this.queryData
      return vm.api
        .getWebPageLoad({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.pageLoadData.loading = true
          }
        })
        .done(res => {
          vm.pageLoadData.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.pageLoadData.loading = false
        })
    },
    getWebApdex() {
      let vm = this
      let query = this.queryData
      vm.api
        .getWebApdex({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.apdexData.loading = true
          }
        })
        .done(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = 'Apdex'
          }
          vm.apdexData.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.apdexData.loading = false
        })
    },
    getWebBrowser() {
      let vm = this
      let query = this.queryData
      vm.api
        .getWebBrowser({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.browserData.loading = true
          }
        })
        .done(res => {
          vm.browserData.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.browserData.loading = false
        })
    },
    getWebBasepv() {
      let vm = this
      let query = this.queryData
      vm.api
        .getWebBasepv({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.basePv.loading = true
          }
        })
        .done(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = '访问量'
          }
          vm.basePv.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.basePv.loading = false
        })
    },
    getWebTop5pv() {
      let vm = this
      let query = this.queryData

      vm.api
        .getWebTop5pv({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.top5pv.loading = true
          }
        })
        .done(res => {
          vm.top5pv.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.top5pv.loading = false
        })
    },
    getWebTop5TimeSpend() {
      let vm = this
      let query = this.queryData

      vm.api
        .getWebTop5TimeSpend({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.top5TimeSpend.loading = true
          }
        })
        .done(res => {
          vm.top5TimeSpend.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.top5TimeSpend.loading = false
        })
    },
    getWebAjaxPv() {
      let vm = this
      let query = this.queryData
      vm.api
        .getWebAjaxPv({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.ajaxPv.loading = true
          }
        })
        .done(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = 'AJAX数量'
          }
          vm.ajaxPv.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.ajaxPv.loading = false
        })
    },
    getWebAjaxTime() {
      let vm = this
      let query = this.queryData
      vm.api
        .getWebAjaxTime({
          data: {
            condition: Object.assign({}, query)
          },
          beforeSend() {
            vm.ajaxTime.loading = true
          }
        })
        .done(res => {
          vm.ajaxTime.data = res || {}
          // return res || {}
        })
        .always(() => {
          vm.ajaxTime.loading = false
        })
    }
  }
}
</script>

