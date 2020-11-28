export default {
  data() {
    return {
      searchAllChangeMerchant: {
        merchantNumber: '',
        documentState: '',
        merchantName: '',
        changeResult: '',
        effectiveDate: '',
        serviceExpirationDate: '',
        merchantExpirationDate: '',
        changeType: '',
        selfHelp: ''
      },
      documentStateOptions: [
        {
          label: '测试',
          value: '测试'
        }
      ],
      changeResultOptions: [
        {
          label: '测试',
          value: '测试'
        }
      ],
      typeOptions: [
        {
          label: '测试',
          value: '测试'
        }
      ],
      selfHelpOptions: [
        {
          label: '测试',
          value: '测试'
        }
      ]
    }
  }
}
