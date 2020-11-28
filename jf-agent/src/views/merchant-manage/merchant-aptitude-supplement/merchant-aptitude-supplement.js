export default {
  data() {
    return {
      merchantKeyQuery: {
        merchantNumber: '',
        merchantFullName: '',
        state: '',
        telephoneNumber: '',
        openDate: ''
      },
      stateOptions: [
        {
          label: '已开通',
          value: 1
        },
        {
          label: '未开通',
          value: 0
        }
      ],
      tableData:[{}]
    }
  }
}
