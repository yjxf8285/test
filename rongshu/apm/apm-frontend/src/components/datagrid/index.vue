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

.au-table {
  color: #666;
  border: 1px solid $borderColor;
  tr {
    border: 0px !important;
    &:nth-child(2n) {
      background-color: #fff;
    }
    &:nth-child(2n + 1) {
      background-color: #f7f7f7;
    }
    &:hover {
      background-color: $borderColor;
    }
  }

  thead {
    tr {
      th {
        font-weight: 700;
        background-color: #ececec;
      }
    }
  }
}
</style>
<template src="./template.html">
</template>
<script>
import FormatterLink from './formatter/link.vue'
export default {
  name: 'datagrid',
  components: {
    'formatter-link': FormatterLink
  },
  data() {
    return {
      bordered: false,
      striped: true,
      slotBody: false,
      themeTrClassName:
        'au-theme-border-color--base-8 au-theme-hover-background-color--base-10 au-theme-background-color--base-11'
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
    dataList: {
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
  mounted() {
    this.slotBody = this.$scopedSlots.rows !== undefined
  },
  computed: {
    localSort() {
      let sortabledColumns = this.columns.filter(col => {
        return col.sortable
      })
      let orderBy =
        this.sort.orderBy ||
        (sortabledColumns.length > 0 ? sortabledColumns[0].code : '')
      let rule = this.sort.rule || 'DESC'
      return {
        orderBy,
        rule
      }
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler(v) {
        if (this.slotBody) {
          this.$nextTick(() => {
            Array.prototype.map.call(this.$el.querySelectorAll('tr'), tr => {
              tr.className = [tr.className, this.themeTrClassName].join(' ')
            })
          })
        }
      }
    },
    loading(state) {
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
    togglePage(currentPage) {
      this.$emit('togglePage', currentPage)
    },
    onSort(sortable, orderBy) {
      if (sortable) {
        let rule =
          this.sort.orderBy === orderBy
            ? this.sort.rule === 'ASC' ? 'DESC' : 'ASC'
            : 'ASC'
        this.sort.orderBy = orderBy
        this.sort.rule = rule
        this.$emit('sort', orderBy, rule)
      }
    }
  }
}
</script>
