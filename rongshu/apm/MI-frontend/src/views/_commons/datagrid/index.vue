<style lang="scss">
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
</style>
<template src="./template.html">
</template>

<script>

export default {
  name: 'datagrid',
  data () {
    return {
      bordered: false,
      striped: true,
      slotBody: false
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
      default: () => { return [] }
    },
    pagination: {
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
    this.slotBody = this.$scopedSlots.rows !== undefined
  },
  computed: {
    localSort () {
      let sortabledColumns = this.columns.filter((col) => {
        return col.sortable
      })
      let orderBy = this.sort.orderBy || (sortabledColumns.length > 0 ? sortabledColumns[0].code : '')
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
      this.$emit('togglePage', currentPage)
    },
    onSort (sortable, orderBy) {
      if (sortable) {
        let rule = this.sort.orderBy === orderBy ? this.sort.rule === 'ASC' ? 'DESC' : 'ASC' : 'ASC'
        this.sort.orderBy = orderBy
        this.sort.rule = rule
        this.$emit('sort', orderBy, rule)
      }
    }
  }
}
</script>
