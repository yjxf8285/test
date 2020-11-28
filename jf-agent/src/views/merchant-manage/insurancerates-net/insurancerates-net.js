import companyInfo from './company-info/company-info.vue'
import aptitudeUpload from './aptitude-upload/aptitude-upload.vue'
import billingInfo from './billing-info/billing-info.vue'
import openProduction from './open-production/open-production.vue'
export default {
  components: {
    companyInfo,
    aptitudeUpload,
    billingInfo,
    openProduction
  },
  data() {
    return {
      insuranceratesNet: {
        merchantsType: '',
        merchantFullName: '',
        receiptName: '',
        merchantArea: '',
        businessAddress: '',
        telephoneNumber: '',
        merchantLinkMan: '',
        subAccount: '',
        debitCardRate: '',
        debitCardRateCap: '',
        creditCardRate: '',
        creditCardRateCap: '',
        codeToPayRate: ''
      },
      elTabName: ''
    }
  },
  methods: {
    chooseTab() {
      // window.console.log(e)
      // window.console.log(this.elTabName)
    }
  }
}
