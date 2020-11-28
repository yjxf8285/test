export default {
  data() {
    return {
      merchantChangeOrderQuery: {
        merchantNumber: '',
        merchantName: '',
        documentState: '',
        changeResult: '',
        effectiveDate: '',
        expirationDate: ''
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
      ]
    }
  }
}
