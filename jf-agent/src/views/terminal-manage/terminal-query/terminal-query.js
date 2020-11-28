/*
 * @Author: wuyulong
 * @Date: 2019-12-27 17:12:50
 * @LastEditTime: 2019-12-31 16:26:14
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/merchant-query/merchant-query.js
 */
export default {
    name: "merchant-query",
    data() {
      return {
        searchMsg: {
          terminalSeriesNumber:"",
          terminalNumber:"",
          merchantNumber: "",
          agent:"",
          state:"",
          isTrade:"",
          brand: "",
          activity:"",
          changeActivity:"",
          activateState:""
        },
        tableData: [{
          merchantNumber: "86121179898",
          merchantName: "北京晴天商贸有限公司",
          merchantState: "开通",
          createDate: "2019-04-01 12:00:00",
          openDate: "2019-04-01 13:00:00",
          telephoneNumber: "183****5164",
          brand: "点付",
          agentNumber: "6620855499",
          agentName: "测试二代",
          area: "北京市辖区朝阳区"
        }],
        options: [],
        loading: false,
        states: ["Alabama", "Alaska", "Arizona",
          "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida",
          "Georgia", "Hawaii", "Idaho", "Illinois",
          "Indiana", "Iowa", "Kansas", "Kentucky",
          "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire",
          "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania",
          "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas",
          "Utah", "Vermont", "Virginia",
          "Washington", "West Virginia", "Wisconsin",
          "Wyoming"],
  
          //dialog
          zfbInfoModify:false,
          zfbDataSupplement:false
      }
    },
    mounted() {
      this.list = this.states.map(item => {
        return { value: `value:${item}`, label: `label:${item}` };
      });
    },
    methods: {
      //跳转详情
      goDetail(index,row){
        this.$router.push({name:"merchant-query-detail"})
      },
      resetSearchMsg() {
        for (let i in this.searchMsg) {
          this.searchMsg[i] = "";
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      }
    }
  }
  