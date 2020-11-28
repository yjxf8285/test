export default {
  data() {
    return {
      dialogVisible: false,
      virtualData: {},
      shareProfitConfig: {

      },
      value1: '',
      value2: '',
      options1: [
        {
          label: '正常',
          value: '1'
        }
      ],
      options2: [
        {
          label: '正常',
          value: '1'
        }
      ],
      tableData: [
        {
          facilitatorAccount: '18530204211',
          facilitatorNumber: '6624726119',
          facilitatorName: '二代分支机构18530204211',
          rate: '30.00%',
          facilitatorState: '关闭',
          facilitatorRemark: '服务商自动...',
          operationState: '正常',
          operationRemark: '',
          operator: '13000110011',
          createTime: '2020-01-06'
        }
      ]
    }
  },
  methods: {
    handleEdit(index, row) {
      this.dialogVisible = true
      // window.console.log(index, row);
      const str = JSON.stringify(row)
      this.virtualData = JSON.parse(str)
      this.virtualData.index = index
    },
    changeData() {
      const index = this.virtualData.index
      const _this = this
      // window.console.log(this.tableData[index]);
      this.tableData.splice(index, 1, _this.virtualData)
      this.dialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => { })
    }
    // handleDelete(index, row) {
    //     window.console.log(index, row);
    // }
  }
}
