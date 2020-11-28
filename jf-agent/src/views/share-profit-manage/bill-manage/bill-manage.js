export default {
  data() {
    return {
      toggleShow: true,
      billManagement: {
        makeBillDate: '',
        billState: '',
        auditState: ''
      },
      billStateOptions: [
        {
          label: '初始化',
          value: '0'
        },
        {
          label: '可用',
          value: '1'
        }
      ],
      auditStateOptions: [
        {
          label: '通过',
          value: '0'
        },
        {
          label: '拒绝',
          value: '1'
        }
      ]
    }
  }
}
