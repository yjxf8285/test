import checkTotal from '../common-check-total/common-check-total.vue'
export default {
  data() {
    return {
      merchantProductionQuery: {
        productionNumber: '',
        productionName: '',
        billingOrigin: '',
        merchantNumber: '',
        merchantName: '',
        tradeTime: '',
        businessRequestNumber: '',
        state: '',
        completeTime: ''
      },
      billingOriginOptions: [
        {
          label: '交易',
          value: '01'
        }, {
          label: '结算',
          value: '11'
        }
      ],
      stateOptions: [
        {
          label: '全部',
          value: '1'
        }, {
          label: '已完成',
          value: '2'
        }, {
          label: '已作废',
          value: '3'
        }, {
          label: '已计费',
          value: '4'
        }, {
          label: '已出账',
          value: '5'
        }, {
          label: '已结算',
          value: '6'
        }, {
          label: '已生成付款单',
          value: '7'
        }
      ]
    }
  },
  methods: {
    open() {
      this.$notify({
        title: '查看合计',
        dangerouslyUseHTMLString: true,
        message: '采购总数量：<span style="color:rgba(64,157,255,1)">2108351</span>。实际到货总数量：<span style="color:rgba(64,157,255,1)">2065838</span>。',
        offset: 100,
        //   duration: 0
      });
    }
  },
  components: {
    checkTotal
  }
}
