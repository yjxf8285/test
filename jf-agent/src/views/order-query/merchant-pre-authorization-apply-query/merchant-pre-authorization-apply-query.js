export default {
  data() {
    return {
      merchantPreAuthorizationApplyQuery: {
        merchantNumber: '',
        merchantName: '',
        documentState: ''
      },
      documentStateOptions: [
        {
          label: '测试',
          value: '测试'
        }
      ]
    }
  }
}
