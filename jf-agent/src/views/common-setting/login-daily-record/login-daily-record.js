/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:58:57
 * @LastEditTime: 2020-05-11 17:15:10
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/login-daily-record/login-daily-record.js
 */

const dataMock = [{
    loginTime: '2020-05-07 00:00:00',
    loginAccount: 'APP',
    ip: 10,
    loginAddress: "北京市朝阳区"
}, {
    loginTime: '2020-05-07 00:00:00',
    loginAccount: 'APP',
    ip: 10,
    loginAddress: "北京市朝阳区"
},{
    loginTime: '2020-05-07 00:00:00',
    loginAccount: 'APP',
    ip: 10,
    loginAddress: "北京市朝阳区"
}, {
    loginTime: '2020-05-07 00:00:00',
    loginAccount: 'APP',
    ip: 10,
    loginAddress: "北京市朝阳区"
},{
    loginTime: '2020-05-07 00:00:00',
    loginAccount: 'APP',
    ip: 10,
    loginAddress: "北京市朝阳区"
}]

export default {
    data() {
        return {
            formObj: {
                exportType: "",
                ip:"",
                date: ""
            },
            rule: {
                exportType: [{
                    required: true,
                    message: "请输入登录账户"
                }],
                ip: [{
                    required: true,
                    message: "请输入登录IP"
                }],
                date: [{
                    required: true,
                    message: "请选择登录时间区间"
                }]
            },
            tableLoading:true,
            tableData: [],
            columns: [
                {
                    label: "登录时间",
                    prop: "loginTime"
                },
                {
                    label: "登录账号",
                    prop: "loginAccount"
                },
                {
                    label: "登录IP",
                    prop: "ip"
                },
                {
                    label: "登录地区",
                    prop: "loginAddress"
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
        },
        childModel(value){
            this.formObj.date = value;
        }
    }
}
