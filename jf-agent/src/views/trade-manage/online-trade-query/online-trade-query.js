import checkTotal from '../common-check-total/common-check-total.vue'
export default {
  data() {
    return {
      onlineTransactionQuery: {
        transactionNumber: '',
        merchantOrderNumber: '',
        orderState: '',
        payWay: '',
        merchantNumber: '',
        orderMoney1: '',
        orderMoney2: '',
        placeOrderTime: '',
        paymentTime: ''
      },
      orderStateOptions: [
        {
          label: '等待付款',
          value: '01'
        },
        {
          label: '成功',
          value: '11'
        },
        {
          label: '失败',
          value: '10'
        },
        {
          label: '关闭',
          value: '00'
        }
      ],
      payWayOptions: [
        {
          label: '个人网银',
          value: 'GRWY'
        },
        {
          label: '企业网银',
          value: 'QYWY'
        },
        {
          label: '快捷',
          value: 'KJ'
        },
        {
          label: '认证',
          value: 'RZ'
        },
        {
          label: '移动支付',
          value: 'YDZF'
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
