/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:58:57
 * @LastEditTime: 2020-05-08 17:18:40
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/export-apply-query/export-apply-query.js
 */

const dataMock = [{
    applyTime: '2020-05-07',
    applyType: 'APP',
    downloadNum: 10,
    downloadTime: '2020-05-07',
    downloadUser: "老谭"
}, {
    applyTime: '2020-05-07',
    applyType: 'APP',
    downloadNum: 10,
    downloadTime: '2020-05-07',
    downloadUser: "老谭"
}, {
    applyTime: '2020-05-07',
    applyType: 'APP',
    downloadNum: 10,
    downloadTime: '2020-05-07',
    downloadUser: "老谭"
}, {
    applyTime: '2020-05-07',
    applyType: 'APP',
    downloadNum: 10,
    downloadTime: '2020-05-07',
    downloadUser: "老谭"
}, {
    applyTime: '2020-05-07',
    applyType: 'APP',
    downloadNum: 10,
    downloadTime: '2020-05-07',
    downloadUser: "老谭"
}]

export default {
    data() {
        return {
            formObj: {
                exportType: "",
                date: ""
            },
            rule: {
                exportType: [{
                    required: false,
                    message: "请选择导出类型"
                }],
                date: [{
                    required: false,
                    message: "请选择申请时间"
                }]
            },
            tableLoading:false,
            tableData: [],
            columns: [
                {
                    label: "申请时间",
                    prop: "applyTime"
                },
                {
                    label: "申请类型",
                    prop: "applyType"
                },
                {
                    label: "下载次数",
                    prop: "downloadNum"
                },
                {
                    label: "下载用户",
                    prop: "downloadUser"
                },
                {
                    label: "下载时间",
                    prop: "downloadTime"
                },
                {
                    slot: "operate"
                }
            ],
            pageObj: {
                size: 2,
                total: 1,
                currentPage: 1,
                func: (currentPage) => {
                    this.pageTurning(currentPage)
                }
            }
        }
    },
    mounted () {
        let size = this.pageObj.size;
        let currentPage = this.pageObj.currentPage;
        let length = dataMock.length;
        this.$set(this.pageObj,"total",length);
        this.tableLoading = true;
        setTimeout(()=>{
            this.tableData = dataMock.slice(0,currentPage*size);
            this.tableLoading = false;
        },500)
    },
    methods: {
        pageTurning(page){
            this.tableLoading = true;
            setTimeout(()=>{
                let size = this.pageObj.size;
                this.$set(this.pageObj,"currentPage",page);
                this.tableData = dataMock.slice((page-1)*size,page*size);
                this.tableLoading = false;
            },500)
        },
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    alert("success")
                }
                else{

                }
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        }
    }
}
