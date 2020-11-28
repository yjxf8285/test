// import checkTotal from "../common-check-total/common-check-total.vue"
const moment = require("moment")
export default {
  data() {
    return {
      searchMsg: {
        tradeDate: "",
        tradeOrderNum: "",
        merchantNum: "",
        terminalSeriesNum: "",
        terminalNum: "",
        cardType: "",
        cardTypeOptions: [
          {
            label: "",
            value: ""
          }
        ],
        cardNum: "",
        tradeMoney1: "",
        tradeMoney2: "",
        refNum: "",
        tradeState: "",
        tradeStateOptions: [
          {
            label: "",
            value: ""
          }
        ],
        brand: "",
        brandOptions: [
          {
            label: "",
            value: ""
          }
        ],
        agent: "",
        agentOptions: [
          {
            label: "",
            value: ""
          }
        ],
        tradeClass: "",
        tradeClassOptions: [
          {
            label: "",
            value: ""
          }
        ],
        productionName: "",
        productionNameOptions: [
          {
            label: "",
            value: ""
          }
        ],
        tradeType: "",
        tradeTypeOptions: [
          {
            label: "",
            value: ""
          }
        ],
        acceptWay: "",
        acceptWayOptions: [
          {
            label: "",
            value: ""
          }
        ]
      },
      tableData:[
        {

        }
      ]
    }
  },
  methods: {
    getDate(args) {
      if (args == "today") {
        this.searchMsg.tradeDate = [moment(), moment()]
      }
      if (args == "yesterday") {
        this.searchMsg.tradeDate = [moment().subtract(1, "days"), moment().subtract(1, "days")]
      }
      if (args == "thisweek") {
        this.searchMsg.tradeDate = [moment().isoWeekday(1), moment().isoWeekday(7)]
      }
      if (args == "lastweek") {
        this.searchMsg.tradeDate = [moment().isoWeekday(1).subtract(1, "weeks"), moment().isoWeekday(7).subtract(1, "weeks")]
      }
      if (args == "thismonth") {
        this.searchMsg.tradeDate = [moment().startOf("month"), moment().endOf("month")]
      }
      if (args == "lastmonth") {
        this.searchMsg.tradeDate = [moment().subtract(1, "months").startOf("month"), moment().subtract(1, "months").endOf("month")]
      }
    },
    open() {
      this.$notify({
        title: "查看合计",
        dangerouslyUseHTMLString: true,
        message: "采购总数量：<span style='color:rgba(64,157,255,1)'>2108351</span>。实际到货总数量：<span style='color:rgba(64,157,255,1)'>2065838</span>。",
        offset: 100,
        //   duration: 0
      });
    },
    goDetail(){
      
    }
  }
}
