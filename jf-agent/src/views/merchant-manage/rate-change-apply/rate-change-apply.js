export default {
  data() {
    return {
      rateChange: {
        merchantNumber: '',
        merchantType: '',
        modeOfPayment: '',
        changeDebitCardRate: '',
        changeCreditCardRate: '',
        changeCloudFlashPayRate: '',
        changeScanCodeRate: '',
        changeDebitCardCapping: '',
        changeChargeMode: '',
        currentCapping: ''
      },
      chargeModeOptions: [
        {
          label: '比例',
          value: '1'
        }
      ],
      merchantTypeOptions: [
        {
          label: '标准商户',
          value: '1'
        },
        {
          label: '优惠商户',
          value: '2'
        }
      ],
      paymentOptions: [
        {
          label: 'T+1',
          value: '1'
        },
        {
          label: '秒到',
          value: '2'
        }
      ]
    }
  }
}
