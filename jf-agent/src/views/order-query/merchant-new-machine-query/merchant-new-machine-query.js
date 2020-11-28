export default {
  data() {
    return {
      tableData: [{}],

      merchantNewMachineQuery: {
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
