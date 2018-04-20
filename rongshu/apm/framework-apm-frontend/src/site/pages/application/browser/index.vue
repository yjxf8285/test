<template>
  <div class="browser">
    <DefaultContainer :title="pageLoadData.title" :lazyloader="pageLoadData.lazyloader">
      <elinebar :loading="pageLoadData.loading" :data="pageLoadData.data" direction="vertical"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="apdexData.title" :lazyloader="apdexData.lazyloader">
      <elinebar :loading="apdexData.loading" :data="apdexData.data" direction="vertical"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="browserData.title" :lazyloader="browserData.lazyloader">
      <elinebar :loading="browserData.loading" :data="browserData.data"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="basePv.title" :lazyloader="basePv.lazyloader">
      <elinebar :loading="basePv.loading" :data="basePv.data"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="top5pv.title" :lazyloader="top5pv.lazyloader">
      <elinebar :loading="top5pv.loading" :data="top5pv.data"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="top5TimeSpend.title" :lazyloader="top5TimeSpend.lazyloader">
      <elinebar :loading="top5TimeSpend.loading" :data="top5TimeSpend.data"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="ajaxPv.title" :lazyloader="ajaxPv.lazyloader">
      <elinebar :loading="ajaxPv.loading" :data="ajaxPv.data"></elinebar>
    </DefaultContainer>
    <DefaultContainer :title="ajaxTime.title" :lazyloader="ajaxTime.lazyloader">
      <elinebar :loading="ajaxTime.loading" :data="ajaxTime.data"></elinebar>
    </DefaultContainer>
  </div>
</template>
<script>
import common from '_common'
import DefaultToolBar from '_components/top-bar'
import {DefaultContainer} from '_components/containers'
import {Elinebar} from '_components/charts'
import {TopBarMixin} from '_mixins'
export default {
  data () {
    return {
      title: '浏览器',
      pageLoadData: {
        loading: false,
        title: '页面加载分析',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebPageLoad
        }

      },
      apdexData: {
        loading: false,
        title: '用户满意度分析',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebApdex
        }
      },
      browserData: {
        loading: false,
        title: '浏览器分析',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebBrowser
        }
      },
      basePv: {
        loading: false,
        title: '访问量',
        data: [],
        lazyloader: {
          lazy: true,
          onload: this.getWebBasepv
        }
      },
      top5pv: {
        loading: false,
        title: 'top5访问量',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebTop5pv
        }
      },
      top5TimeSpend: {
        loading: false,
        title: 'top5耗时',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebTop5TimeSpend
        }
      },
      ajaxPv: {
        loading: false,
        title: 'ajax数量',
        data: [],
        lazyloader: {
          lazy: true,
          onload: this.getWebAjaxPv
        }
      },
      ajaxTime: {
        loading: false,
        title: 'ajax时间',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getWebAjaxTime
        }
      },
      queryData: {
        appId: '',
        aggrInterval: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mixins: [TopBarMixin],
  components: {
    DefaultToolBar,
    DefaultContainer,
    Elinebar
  },
  watch: {
    topBarQueryData: {
      deep: true,
      handler (v) {
        this.pageLoadData.lazyloader.loaded = false
        this.apdexData.lazyloader.loaded = false
        this.browserData.lazyloader.loaded = false
        this.basePv.lazyloader.loaded = false
        this.top5pv.lazyloader.loaded = false
        this.top5TimeSpend.lazyloader.loaded = false
        this.ajaxPv.lazyloader.loaded = false
        this.ajaxTime.lazyloader.loaded = false
      }
    }
  },
  methods: {
    getWebPageLoad () {
      let vm = this
      return vm.api.getWebPageLoad({
        data: {
          condition: Object.assign({}, vm.topBarQueryData)
        }
      })
        .then(res => {
          let data = res.data || []
          vm.pageLoadData.data = common.lineChartDataFormatter(data, {axisName: 'ms'})
        })
    },
    getWebApdex () {
      let vm = this
      vm.api.getWebApdex({
        data: {
          condition: Object.assign({}, vm.topBarQueryData)
        }
      })
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = 'Apdex'
          }
          let data = res.data || []
          vm.apdexData.data = common.lineChartDataFormatter(data, {axisName: 'apdex'})
        })
    },
    getWebBrowser () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebBrowser({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          let data = res.data || []
          vm.browserData.data = common.lineChartDataFormatter(data)
        })
    },
    getWebBasepv () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebBasepv({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = '访问量'
          }
          let data = res.data || []
          vm.basePv.data = common.lineChartDataFormatter(data)
        })
    },
    getWebTop5pv () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebTop5pv({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          let data = res.data || []
          vm.top5pv.data = common.lineChartDataFormatter(data)
        })
    },
    getWebTop5TimeSpend () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebTop5TimeSpend({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          let data = res.data || []
          vm.top5TimeSpend.data = common.lineChartDataFormatter(data, {axisName: 'ms'})
        })
    },
    getWebAjaxPv () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebAjaxPv({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data[0].name = 'AJAX数量'
          }
          let data = res.data || []
          vm.ajaxPv.data = common.lineChartDataFormatter(data)
        })
    },
    getWebAjaxTime () {
      let vm = this
      let query = this.topBarQueryData
      vm.api.getWebAjaxTime({
        data: {
          condition: Object.assign({}, query)
        }
      })
        .then(res => {
          let data = res.data || []
          vm.ajaxTime.data = common.lineChartDataFormatter(data, {axisName: 'ms'})
        })
    }
  }
}
</script>
