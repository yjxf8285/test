export default {
  data() {
    return {
      branchChangeOrderQuery: {
        merchantNumber: '',
        branchNumber: '',
        documentState: '',
        changeType: ''
      },
      documentStateOptions: [
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
      ]
    }
  }
}
