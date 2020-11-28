export default {
  data() {
    return {
      aptitudeUpload: [
        {
          label: '法人身份证（正面）',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '法人身份证（背面）',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '营业执照',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '商户协议',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '商户协议2',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '商户协议3',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '商户协议4',
          fileList: [{ name: '123' }, { name: '456' }]
        },
        {
          label: '商户协议5',
          fileList: [{ name: '123' }, { name: '456' }]
        }
      ],
      otherInfoUpload: [
        {
          label: '开户许可证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: '如个体户无开户许可证，请上传服务商出具的证明材料'
        },
        {
          label: '法人结算卡',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '门头照片',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '税务登记证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: '如个体户无税务登记证,请上传免税证明或服务商出具的证明'
        },
        {
          label: '组织机构代码证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: '对公户必填，个体户可不填'
        },
        {
          label: '收银台照片',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '经营场景照片',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '市场照片',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '资质真实性证明（保证函）',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: 'POS三方协议',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '租赁协议一',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '租赁协议二',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '租赁协议三',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '电信合作协议一',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '电信合作协议二',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '电信合作协议三',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '航空客运代理证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '道路运输许可证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '停车场备案证明',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '成品油零售经营许可证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '旅行社经营许可证',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '事业单位法人证书',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        },
        {
          label: '其他',
          fileList: [{ name: '123' }, { name: '456' }],
          annotation: ''
        }
      ],
      hasShow: false,
      otherInfoButton: '上传其他资质信息'
    }
  },
  methods: {
    toggleShow() {
      this.otherInfoButton = this.otherInfoButton == '上传其他资质信息' ? '取消上传其他资质信息' : '上传其他资质信息'
      this.hasShow = this.hasShow == false
    },
    handleRemove(file, fileList) {
      window.console.log(file, fileList)
    },
    handlePreview(file) {
      window.console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
