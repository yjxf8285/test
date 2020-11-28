export default {
  data() {
    return {
      date: '',
      state: '',
      useMode: '',
      activateType: '',
      activateState: '',
      partPos: '',
      stateOptions: [
        {
          label: '交易',
          value: '1'
        },
        {
          label: '已分配',
          value: '2'
        },
        {
          label: '已绑定',
          value: '3'
        },
        {
          label: '在途',
          value: '4'
        }
      ],
      useModeOptions: [
        {
          label: '移动机具',
          value: 'YDJJ'
        },
        {
          label: '固定机具',
          value: 'GDJJ'
        }
      ],
      activateTypeOptions: [
        {
          label: '趣付传统POS活动',
          value: '1'
        },
        {
          label: '开店宝第一季活动',
          value: '2'
        }
      ],
      brandOptions: [
        {
          label: '点付',
          value: '1'
        },
        {
          label: '开刷',
          value: '2'
        }
      ],
      activateStateOptions: [
        {
          label: '已激活',
          value: '1'
        },
        {
          label: '未激活',
          value: '2'
        }
      ],
      partPosOptions: [
        {
          label: '可以',
          value: '1'
        },
        {
          label: '不可以',
          value: '2'
        }
      ]
    }
  },
  methods: {
  }
}
