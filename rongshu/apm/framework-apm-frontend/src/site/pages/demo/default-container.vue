<template>
  <div>
    <default-container
      :title="title"
      :title-icon="titleIcon">
      <div slot="toolbar"><input type="text"></div>
    </default-container>
  </div>
</template>
<script>
import {DefaultContainer} from '../../components/containers'
import {
  Panel
} from 'admin-ui'
export default {
  name: 'demo',
  components: {
    DefaultContainer,
    Panel
  },
  data () {
    return {
      showHeader: true,
      title: '标题设置',
      titleIcon: 'list' // chart-line,chart-bar,list
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.api.getUserList().then(res => {
        this.datagrid.data = res.dataObject.users
        this.datagrid.pageSize = res.dataObject.pageSize
        this.datagrid.currentPage = res.dataObject.startIndex
        this.datagrid.total = res.dataObject.totalNum
      })
    },
    onPageChanged (currentPage) {
      this.getData()
    },
    onSortChanged (orderBy, rule) {
      this.getData()
    }
  }
}
</script>
