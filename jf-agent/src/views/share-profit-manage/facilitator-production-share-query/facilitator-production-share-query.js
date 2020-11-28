export default {
  data() {
    return {
      facilitatorProductionShareQuery: {
        date: '',
        productionName: '',
        classOfActivities: '',
        state: ''
      },
      productionNameOptions: [
        {
          label: 'i版宝及时付',
          value: '0'
        },
        {
          label: 'i版宝自助提现',
          value: '1'
        },
        {
          label: 'i版宝自助提现-秒到',
          value: '2'
        },
        {
          label: 'T+0假日结算',
          value: '3'
        },
        {
          label: 'i版宝假日付',
          value: '4'
        },
        {
          label: '及时付-秒到（i刷）',
          value: '5'
        },
        {
          label: '及时付-秒到（大POS）',
          value: '6'
        },
        {
          label: '优先结算F',
          value: '7'
        },
        {
          label: '服务费代收',
          value: '8'
        }
      ],
      activitiesOptions: [
        {
          label: '2016Q4i刷市场活动（认购≦1万台）',
          value: '0'
        },
        {
          label: '2016Q4i刷市场活动（认购＜1万台*≦3万台）',
          value: '1'
        },
        {
          label: '2016Q4i刷市场活动（认购＜3万台*≦5万台）',
          value: '2'
        },
        {
          label: '2016Q4i刷市场活动（认购5万台以上）',
          value: '3'
        }

      ],
      stateOptions: [
        {
          label: '增加',
          value: '1'
        },
        {
          label: '减少',
          value: '0'
        }
      ]
    }
  },
  methods: {

  }
}
