/*
 * @Author: wuyulong
 * @Date: 2020-01-14 15:58:57
 * @LastEditTime: 2020-05-11 09:48:42
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/system-notice/system-notice.js
 */

const dataMock = [{
    title: '沉默商户激活奖励活动通知',
    publishDate: '2020-05-08'
}, {
    title: '政策延期通知',
    publishDate: '2020-05-08'
}, {
    title: '沉默商户激活奖励活动通知',
    publishDate: '2020-05-08'
}, {
    title: '政策延期通知',
    publishDate: '2020-05-08'
}, {
    title: '沉默商户激活奖励活动通知',
    publishDate: '2020-05-08'
}]

export default {
    data() {
        return {
            test:"",
            formObj: {
                title: "",
                publishDate:[]
            },
            rule: {
                title: [{
                    required: true,
                    message: "请输入标题"
                }],
                publishDate: [{
                    type:"array",
                    required: true,
                    message: "请选择发布日期区间"
                }]
            },
            tableLoading:false,
            tableData: [],
            columns: [
                {
                    label: "标题",
                    prop: "title"
                },
                {
                    label: "发布时间",
                    prop: "publishDate"
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
            },
            showDetail:false,
            detailTitle:""
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
        watchNotice(row){
            console.log(row)
            this.detailTitle = row.title;
            this.showDetail = true;
        },
        childModel(child){
            // console.log(x);
            this.formObj.publishDate=child?child:[];
        },
        hahaha(x){
            console.log(x)
        }
    }
}
