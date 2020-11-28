export default {
    data() {
        return {
            activeName: "first",

            //商户信息
            merchantInformation: [
                {
                    label: "商户编号",
                    value: "86121179898"
                },
                {
                    label: "商户名称",
                    value: "北京晴天商贸有限公司"
                },
                {
                    label: "商户状态",
                    value: "开通"
                },
                {
                    label: "开通时间",
                    value: "2020-04-01 13:00:00"
                },
                {
                    label: "商户类型",
                    value: "企业"
                },
                {
                    label: "归属品牌",
                    value: "点付"
                },
                {
                    label: "所属代理编号",
                    value: "6620855499"
                },
                {
                    label: "所属代理名称",
                    value: "测试二代"
                },
                {
                    label: "所属地区",
                    value: "北京市辖区朝阳区"
                },
                {
                    label: "装机地址",
                    value: "北京朝阳区康家沟1号院"
                },
                {
                    label: "商户联系人",
                    value: "司成飞"
                },
                {
                    label: "联系人手机号码",
                    value: "183****5164"
                },
                {
                    label: "法人姓名",
                    value: "夏琳"
                },
                {
                    label: "法人手机号码",
                    value: "183****5165"
                },
                {
                    label: "证件类型",
                    value: "身份证"
                },
                {
                    label: "证件号",
                    value: "110103********1534"
                },
                {
                    label: "证件有效期",
                    value: "2020/01/10 ~ 2120/01/10"
                },
                {
                    label: "营业执照编号",
                    value: "914101053493889849"
                },
                {
                    label: "营业执照有效期",
                    value: "2015/07/03 ~ 长期有效"
                },
                {
                    label: "沉默商户",
                    value: "是"
                },
            ],

            //费率信息
            rateInformation: [
                {
                    label: "借记卡费率-封顶值",
                    value: "0.60%  -  20元"
                },
                {
                    label: "贷记卡费率",
                    value: "0.60%"
                },
                {
                    label: "D0附加费率",
                    value: "0.05%"
                },
                {
                    label: "小额双免费率",
                    value: "0.38%"
                },
                {
                    label: "NFC移动支付费率",
                    value: "0.38%"
                },
                {
                    label: "扫码支付费率",
                    value: "0.38%"
                },
            ],

            //结算信息
            billInformation: {
                billWay: "T+1",
                billAccount: [
                    {
                        accountType: "01",
                        message: {
                            accountType: "对公",
                            openArea: "测试",
                            openBank: "测试",
                            openBranchBank: "测试",
                            openName: "测试",
                            openAccount: "测试"
                        }

                    },
                    {
                        accountType: "02",
                        message: {
                            accountType: "对公1",
                            openArea: "测试1",
                            openBank: "测试1",
                            openBranchBank: "测试1",
                            openName: "测试1",
                            openAccount: "测试1"
                        }
                    }

                ]
            },
            posInformation: [
                {
                    label: "商户可绑定机具总数",
                    value: ""
                },
                {
                    label: "终端序列号",
                    value: ""
                },
                {
                    label: "终端号",
                    value: ""
                },
                {
                    label: "厂商",
                    value: ""
                },
                {
                    label: "机型",
                    value: ""
                },
                {
                    label: "软件版本号",
                    value: ""
                },
                {
                    label: "参数版本号",
                    value: ""
                },
                {
                    label: "终端状态",
                    value: ""
                },
                {
                    label: "交易状态",
                    value: ""
                },
            ],
            aptitudeInformation: [
                {
                    label: "营业执照",
                    value: ""
                },
                {
                    label: "法人身份证（正面）",
                    value: ""
                },
                {
                    label: "法人身份证（背面）",
                    value: ""
                }
            ]
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        goBack() {
            this.$router.push({ name: "merchant-query" })
        }
    }
};