/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:27:52
 * @LastEditTime: 2020-04-29 16:51:46
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/index/index.js
 */

// import JfUploadExcel from "../../ui-components/JfUploadExcel";

export default {
    data() {
        return {
            readState: false,
            dataCount: "全部品牌",
            currentMonthTrade: "",
            yesterdayTrade: "",
            dataCountOptions: [
                {
                    label: "点付",
                    value: "df"
                },
                {
                    label: "趣付传统",
                    value: "qfct"
                },
                {
                    label: "趣付电签",
                    value: "qfdq"
                },
                {
                    label: "开刷",
                    value: "ks"
                },
            ],
            brandOptions: [
                {
                    name: "df",
                    currentMonthTrade: "12333",
                    yesterdayTrade: "32323"
                },
                {
                    name: "qfct",
                    currentMonthTrade: "qfct111111",
                    yesterdayTrade: "qfct11111111"
                },
                {
                    name: "qfdq",
                    currentMonthTrade: "qfdq2222",
                    yesterdayTrade: "qfdq2222"
                },
                {
                    name: "ks",
                    currentMonthTrade: "ks",
                    yesterdayTrade: "ks"
                }
            ],
            bussinessNoticeOptions: [
                {
                    value: "所有服务商代理商按地区、服务商发布 服务商发步",
                    readState: false
                },
                {
                    value: "所有服务商代理商按地区、服务商发布 服务商发步",
                    readState: false
                },
                {
                    value: "所有服务商代理商按地区、服务商发布 服务商发步",
                    readState: false
                },

            ],
            loading: false,
            isReceived: true,
            QualificationInput: false,
            fileList: [
                // {
                //     name: "food.jpeg",
                //     url:
                //         "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                // }
            ]
        }
    },
    computed: {
        hasRead() {
            if (!this.readState) {
                return {
                    'unread-state-yes': false,
                    'unread-state-no': true
                }
            } else {
                return {
                    'unread-state-yes': true,
                    'unread-state-no': false
                }
            }
        }
    },
    methods: {
        queryReceived() {
            this.isReceived = true
        },
        queryUnreceive() {
            this.isReceived = false
        },
        changeBrand(currentValue) {
            let _this = this;
            console.log(`切换品牌为${currentValue}`)
            this.brandOptions.forEach((item) => {
                if (item.name === currentValue) {
                    _this.currentMonthTrade = item.currentMonthTrade;
                    _this.yesterdayTrade = item.yesterdayTrade;
                }
            })
        }
    }
}
