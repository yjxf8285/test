<!--
 * @Author: wuyulong
 * @Date: 2020-04-28 15:36:09
 * @LastEditTime: 2020-04-30 10:38:49
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/ui-components/JfUploadExcel/index.vue
 -->
<template>
    <div class="jf-upload-excel">
        <el-upload
            class="upload-excel"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept=".xlsx,.xls"
            multiple
            :limit="limit"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :file-list="fileList"
            :disabled="loading"
        >
            <div class="jf-upload-button">
                <el-button 
                    size="mini" 
                    type="primary"
                    :loading='loading'
                >点击上传Excel</el-button>
                <div slot="tip" class="el-upload__tip">{{tips}}</div>
            </div>
        </el-upload>
    </div>
</template>

<style lang="scss" scoped>
    .jf-upload-button{
        display: flex;
        align-items: center;
        .el-upload__tip{
            margin-left: 10px;
            color: #f00;
            font-size: 12px;
            margin-top:0;
        }
    }
</style>

<script>

// const JfUploadExcel = {
//     install:function(Vue){
//         Vue.com
//     }
// }

export default {
    name:"JfUploadExcel",
    data() {
        return{
            loading:false
        }
    },
    props:{
        fileList:{
            type:Array,
            default:[]
        },
        tips:{
            type:String,
            default:"只能上传xlsx/xls文件,且不超过500kb"
        },
        limit:{
            type:Number,
            default:1
        }
    },
    methods: {
        handleSuccess(response, file, fileList){
            this.$emit("handleSuccess",arguments);
        },
        handleChange(file, fileList){

            let index = fileList.findIndex((el)=>{
                return el.name == file.name;
            })

            this.loading = true;
            let filter = fileList.filter((el)=>{
                return el.status == "success";
            });

            if(filter.length==fileList.length){
                this.loading = false;
            }

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择${this.limit}个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            ); 
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        }
    }
};
</script>