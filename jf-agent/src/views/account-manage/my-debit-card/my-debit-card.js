export default {
  data() {
    return {
      isEdit: false,
      myDebitCard: {
        city: 'shuangyashan',
        cityLabel: '双鸭山',
        openingBank: '',
        openingBankLabel: '中国工商银行'
      },
      virtualData: {
        city: '',
        cityLabel: '',
        openingBank: '',
        openingBankLabel: ''
      },
      areaOptions: [
        {
          label: '北京',
          value: 'beijing'
        },
        {
          label: '黑龙江',
          value: 'heilongjiang',
          children: [
            {
              label: '大庆',
              value: 'daqing'
            },
            {
              label: '哈尔滨',
              value: 'haerbin'
            }
          ]
        }
      ],
      bankOptions: [
        {
          label: '中国工商银行',
          value: 'ZGGSYH'
        },
        {
          label: '中国建设银行',
          value: 'ZGJSYH'
        }

      ]
    }
  },
  methods: {
    confirm() {
      this.isEdit = false
      for (const i in this.virtualData) {
        // 虚拟数据赋值给myDebitCard
        this.myDebitCard[i] = this.virtualData[i]
        // 清空虚拟数据
        this.virtualData[i] = ''
      }
    },
    cancel() {
      this.isEdit = false
    },
    changeCity() {
      // 获取选择的label
      this.virtualData.cityLabel = this.$refs.area.getCheckedNodes()[0].label
    },
    changeBank() {
      // 获取选择的label
      this.virtualData.openingBankLabel = this.$refs.bank.getCheckedNodes()[0].label
    }
  },
  mounted() {
    // alert()
  }
}
