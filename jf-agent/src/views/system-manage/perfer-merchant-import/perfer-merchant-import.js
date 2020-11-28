/*
 * @Author: wuyulong
 * @Date: 2020-01-02 18:35:42
 * @LastEditTime: 2020-05-06 17:56:59
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/perfer-merchant-import/perfer-merchant-import.js
 */

const dataMock = [{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
},{
    customerNo: '12344556',
    customerName: '王小虎',
    open: '已开户',
    address: '上海市普陀区金沙江路 1518 弄',
    auth: '是'
}];

export default {
    data() {
        return {
            licenseNo: '',
            doStart: '',
            doEnd: '',
            doResult: '',
            fileList: [],
            tableData: [],
            columns: [
                { label: '商户名称', prop: 'customerName' },
                { label: '商户编号', prop: 'customerNo' },
                { label: '开户情况', prop: 'open' },
                { label: '商户地址', prop: 'address' },
                { label: '是否授权', prop: 'auth' },
                { slot: 'operate' }], // 操作列
            loading: false,
            pageObj: {
                size: 5,
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
        this.loading = true;
        setTimeout(()=>{
            this.tableData = dataMock.slice(0,currentPage*size);
            this.loading = false;
        },500)
    },
    methods: {
        pageTurning(page){
            this.loading = true;
            setTimeout(()=>{
                let size = this.pageObj.size;
                this.$set(this.pageObj,"currentPage",page);
                this.tableData = dataMock.slice((page-1)*size,page*size);
                this.loading = false;
            },500)
        }
    }
}
