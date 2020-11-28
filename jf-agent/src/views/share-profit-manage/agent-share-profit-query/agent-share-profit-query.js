export default {
  data() {
    return {
      agentShareProfitQuery: {
        facilitatorAccount: '',
        facilitatorCode: '',
        facilitatorName: '',
        enterState: '',
        operationState: '',
        facilitatorState: '',
        date: ''
      },
      enterStateOptions: [
        {
          label: '全部',
          value: '11'
        },
        {
          label: '已入账',
          value: '10'
        },
        {
          label: '未入账',
          value: '00'
        }
      ],
      operationStateOptions: [
        {
          label: '正常',
          value: '11'
        },
        {
          label: '关闭',
          value: '10'
        }
      ],
      facilitatorStateOptions: [
        {
          label: '正常',
          value: '11'
        },
        {
          label: '关闭',
          value: '10'
        }
      ],
      tableData: [

      ]
    }
  },
  methods: {

  }
}
