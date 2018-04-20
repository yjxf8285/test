<style lang="scss">
$borderColor: #dcdcdc;
.paginator {
  padding: 12px;
  text-align: right;

  .paginator-summary {
    float: left;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    color: #a79c9c;
  }
}
span.icon-sort {
  display: inline-block;
  width: 8px;
  height: 16px;
  position: relative;
  i.fa {
    width: 8px;
    height: 8px;
    position: absolute;
    &.fa-caret-up {
      left: 0px;
      top: 0px;
    }
    &.fa-caret-down {
      left: 0px;
      bottom: 0px;
    }
    &.selected {
      color: #1d85e3;
    }
  }
}
</style>
<template>
<div ref="datagrid" class="datagrid">
  <au-table :striped="striped" :bordered="bordered" ref="dataTble">
    <colgroup>
    <col v-for="(column, index) in columns"
            :key="index" :style="{
              width: column.width
            }" />
    </colgroup>
    <thead>
      <tr>
        <th v-for="(column, index) in columns"
            @click="onSort(column.sortable, column.field)"
            :key="index">{{column.text}}
          <span class="icon-sort" v-show="column.sortable">
            <i class="fa fa-caret-up" :class="{
                selected:localSort.orderBy==column.field && localSort.rule==='ASC'
              }" aria-hidden="true"></i>
            <i class="fa fa-caret-down" :class="{
                selected:localSort.orderBy==column.field && localSort.rule==='DESC'
              }" aria-hidden="true"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-show="data.length==0">
        <td :colspan="columns.length" style="height: 30px;line-height: 30px;text-align: center">暂无数据</td>
      </tr>
      <tr v-for="(entry, r) in data" :key="r">
        <td v-for="(column, c) in columns" :key="c">
          <div>
            <slot :name="column.field" :row="entry">
              <div :style="column.styler" v-if="!column.custom">
                {{entry[column.field]}}
              </div>
            </slot>
          </div>
        </td>
      </tr>
    </tbody>
  </au-table>
  <div class="paginator" v-show="pagination">
    <au-paginator :total="totalCount" :size="pageSize" :current="currentPage" @toggle="togglePage" />
  </div>
</div>
</template>
<script>
export default {
  name: 'datagrid',
  data () {
    return {
      bordered: false,
      striped: true // ,
      // themeTrClassName: 'au-theme-border-color--base-8 au-theme-hover-background-color--base-10 au-theme-background-color--base-11'
    }
  },

  props: {
    /*
     * 加载数据标识
     */
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    totalCount: Number,
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    pagination: {
      type: Boolean,
      default: true
    },
    sortOrderBy: {
      type: String,
      default: ''
    },
    sortRule: {
      type: String,
      default: 'ASC'
    },
    clientSort: {
      type: Boolean,
      default: true
    },
    sort: {
      type: Object,
      default: () => {
        return {
          orderBy: '',
          rule: 'ASC'
        }
      }
    }
  },
  mounted () {
  },
  computed: {
    localSort () {
      let sortabledColumns = this.columns.filter(col => {
        return col.sortable
      })
      let orderBy =
        this.sort.orderBy ||
        (sortabledColumns.length > 0 ? sortabledColumns[0].field : '')
      let rule = this.sort.rule || 'DESC'
      return {
        orderBy,
        rule
      }
    }
  },
  watch: {
    loading (state) {
      if (state) {
        this.loader = this.$loading({
          target: this.$refs.datagrid,
          text: '正在加载中...'
        })
      } else {
        this.loader && this.loader.close()
        this.loader = null
      }
    }
  },
  methods: {
    togglePage (currentPage) {
      this.$emit('onPageChanged', currentPage)
    },
    onSort (sortable, orderBy) {
      if (sortable) {
        let rule =
          this.sort.orderBy === orderBy
            ? this.sort.rule === 'ASC' ? 'DESC' : 'ASC'
            : 'ASC'
        this.sort.orderBy = orderBy
        this.sort.rule = rule
        this.$emit('onSortChanged', orderBy, rule)
      }
    }
  }
}
</script>
