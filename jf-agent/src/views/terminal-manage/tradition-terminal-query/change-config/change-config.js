export default {
  data() {
    return {
      brand: '',
      activateName: '',
      returnMoney: '',
      brandOptions: [
        {
          label: '点付',
          value: '0'
        },
        {
          label: '趣付-传统POS',
          value: '2'
        },
        {
          label: '趣付-电签版',
          value: '2'
        }
      ],
      activateNameOptions: [
        {
          label: '2019年Q4点付活动',
          value: '1'
        }
      ],
      returnMoneyOptions: [
        {
          label: '1-199',
          value: '1'
        }
      ]

    }
  },
  methods: {
  }
}
