<template>
  <div class="error">
    <!--<FilterBarComplex ref="simplefilterbar" :contribution="true" @fbarChange="fbarChange"></FilterBarComplex>-->
    <div>
      <au-grid width-lg="8" width-xs="12">
        <DefaultContainer :title="errorsTread.title" :lazyloader="errorsTread.lazyloader">
          <elinebar :loading="errorsTread.loading" :data="errorsTread.data"></elinebar>
        </DefaultContainer>
      </au-grid>
      <au-grid width-lg="4" width-xs="12">
        <DefaultContainer :title="errorsInfo.title" :lazyloader="errorsInfo.lazyloader">
          <elinebar :loading="errorsInfo.loading" :data="errorsInfo.data"></elinebar>
        </DefaultContainer>
      </au-grid>
    </div>
    <div class="">
      <DefaultContainer :title="errorsList.title" :lazyloader="errorsList.lazyloader">
        <DataGrid
          :columns="datagrid.columns"
          :data="datagrid.data"
          :pagination="true"
          :totalCount="datagrid.total"
          :pageSize="datagrid.pageSize"
          :currentPage="datagrid.currentPage"
          @onPageChanged="onPageChanged"
          @onSortChanged="onSortChanged">
        </DataGrid>
      </DefaultContainer>
    </div>
  </div>
</template>

<script>
import util from '_utils'
import store from '_store'
import FilterBarComplex from '_components/filter-bar'
import {DefaultContainer} from '_components/containers'
import DataGrid from '../../../../components/datagrid'
import {Elinebar} from '_components/charts'

export default {
  data () {
    return {
      dataListloading: true,
      summariesSortField: 'AVG_RESPONSE_TIME',
      summariesSortOrder: 'desc',
      transName: '',
      dataList: [],
      allDataList: [],
      queryData: {
        appId: '',
        aggrInterval: '',
        startTime: '',
        endTime: ''
      },
      errorsTread: {
        loading: false,
        title: '错误数趋势',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getErrorTread
        }
      },
      errorsInfo: {
        loading: false,
        title: '错误信息（TOP 5）',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getErrorInfo
        }
      },
      errorsList: {
        loading: false,
        title: '错误列表',
        data: [],
        lazyloader: {
          lazy: true,
          loaded: true,
          onload: this.getErrorList
        }
      },
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
  components: {
    FilterBarComplex,
    DefaultContainer,
    DataGrid,
    Elinebar
  },
  mounted () {
    store.$on('change', this.onApplicationConditionChanged)
  },
  destroyed () {
    store.$off('change', this.onApplicationConditionChanged)
  },
  watch: {
    transName () {
      // this.getSummariesData()
      this.$refs.simplefilterbar.reset()
    },
    queryData: {
      deep: true,
      handler (v) {
        this.errorsInfo.lazyloader.loaded = false
        this.errorsTread.lazyloader.loaded = false
        this.errorsList.lazyloader.loaded = false
      }
    }
  },
  computed: {
    tierId () {
      return this.$route.query.tierId || ''
    },
    instanceToken () {
      return this.$route.query.instanceToken || ''
    }
  },
  methods: {
    fbarChange (condition) {
      console.info('fc', condition)
    },

    onPageChanged (currentPage) {

    },
    onSortChanged (orderBy, rule) {

    },

    onApplicationConditionChanged (appCondition) {
      this.queryData = {
        appId: appCondition[store.states.current_application.name].appId,
        startTime: appCondition[store.states.current_timerange.name].startTime,
        endTime: appCondition[store.states.current_timerange.name].endTime,
        aggrInterval: appCondition[store.states.current_timerange.name].aggrInterval
      }
      console.log('onApplicationConditionChanged')
      console.log(this.queryData)
    },

    getErrorInfo () {

    },

    getErrorTread () {

    },

    getErrorList () {
      this.errorListloading = true
      this.api
        .getErrorList({
          data: {
            condition: {
              startTime: '1521097169811',
              endTime: '1521701969811',
              appId: '738541481710747648',
              searchKey: '',
              instanceArray: [],
              errorArray: []
            },
            page: {
              index: this.pageIndex,
              size: 10
            },
            sort: {
              field: 'finishTime',
              order: 'desc'
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            res.data.errorArray.map(m => {
              m.startTime = util.formatDate(m.startTime)
            })
            this.errListData = res.data.errorArray
            this.errListDataTotal = res.data.totalSize
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  $green: #a8d96f;
  $orange: #85cae6;
  $lightred: #fab421;
  $red: #f38211;
  .error {
    .table-wrap {
      padding: 10px;
    }
    .table-list {
      width: 100%;
      .icon {
        font-size: 20px;
        color: #00acc1;
        vertical-align: middle;
      }
      .error-name {
        vertical-align: middle;
      }
    }
    .pagination-wrap {
      padding: 0 5px 0 0;
      text-align: right;
    }
  }
</style>
