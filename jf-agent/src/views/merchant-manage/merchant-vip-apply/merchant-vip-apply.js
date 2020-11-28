export default {
  data() {
    return {
      merchantVIPApply: {
        merchantNumber: '',
        merchantName: '',
        vipDateQuery: '',
        typeOfVip: ''
      },
      typeOfVipOptions: [
        {
          label: '免费',
          value: '1'
        },
        {
          label: '成本上浮',
          value: '2'
        }
      ]
    }
  }
}
