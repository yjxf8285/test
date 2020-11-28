export default {
  data() {
    return {
      billingInfo: [
        {
          openAccountArea: '',
          accountType: '',
          openBank: '',
          unionpayNumber: '',
          branchInformation: '',
          openAccountName: '',
          openAccountNumber: '',
          openAccountNumberCompare: '',
          assist: ''
        }
      ],

      areaOptions: [],
      accountTypeOptions: [
        {
          label: '法人',
          value: '1'
        },
        {
          label: '对公',
          value: '0'
        }
      ],
      openBankOptions: [
        {
          label: '中国银行',
          value: '1'
        }
      ]
    }
  },
  methods: {
    handleChange() { },
    addArticle() {
      this.billingInfo.push({
        openAccountArea: '',
        accountType: '',
        openBank: '',
        unionpayNumber: '',
        branchInformation: '',
        openAccountName: '',
        openAccountNumber: '',
        openAccountNumberCompare: '',
        assist: ''
      })
    },
    removeArticle() {
      if (this.billingInfo.length == 1) return
      this.billingInfo.pop()
    }
  }
}
