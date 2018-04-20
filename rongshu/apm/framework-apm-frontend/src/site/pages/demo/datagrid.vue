<template>
  <div>
    <au-scroller>
      default mode:
      <DataGrid
        :columns="datagrid.columns"
        :data="datagrid.data"
        :pagination="true"
        :totalCount="datagrid.total"
        :pageSize="datagrid.pageSize"
        :currentPage="datagrid.currentPage"
        @onPageChanged="onPageChanged"
        @onSortChanged="onSortChanged"
        >
      </DataGrid>
      自定义列:
      <DataGrid :columns="datagrid.columns" :data="datagrid.data" :pagination="false">
        <div slot="name" slot-scope="props">{{ props.row.name }}</div>
        <div slot="sex" slot-scope="props">{{ props.row.sex }}</div>
      </DataGrid>
    </au-scroller>
  </div>
</template>
<script>
import DataGrid from '../../components/datagrid'
import {
  Panel
} from 'admin-ui'
export default {
  name: 'demo',
  components: {
    DataGrid,
    Panel
  },
  data () {
    return {
      datagrid: {
        pagination: false,
        pageSize: 10,
        total: 1,
        currentPage: 1,
        columns: [
          {
            field: 'name',
            text: '名称',
            width: '40%',
            sortable: true
          },
          {
            field: 'sex',
            width: '',
            text: '性别'
          }
        ],
        data: [
        ]
      }
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
