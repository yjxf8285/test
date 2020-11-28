export default {
  data() {
    return {
      tableData: [{}],

      companyInfoChangeOrderQuery: {
        merchantNumber: '',
        processInstanceID: '',
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
