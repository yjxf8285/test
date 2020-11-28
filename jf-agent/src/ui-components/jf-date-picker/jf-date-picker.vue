<!--
 * @Author: wuyulong
 * @Date: 2020-04-28 15:36:09
 * @LastEditTime: 2020-05-11 15:20:05
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/ui-components/jf-date-picker/jf-date-picker.vue
 -->
<template>
    <div class="jf-date-picker">
        <el-date-picker
            v-model="start"
            type="date"
            :placeholder="startPlaceholder"
            size="mini"
            style="width:100%;"
            
        >
        </el-date-picker>
        <span class="picker-line">-</span>
        <el-date-picker
            v-model="end"
            type="date"
            :placeholder="endPlaceholder"
            size="mini"
            style="width:100%;"
            :disabled="endDisabled"
            @change="change_end"
        >
        </el-date-picker>
    </div>
</template>

<style lang="scss" scoped>

@import "@/styles/common.scss";

.jf-date-picker {
    width:100%; display:flex;
    .picker-line{
        margin:0 7px;
        color: #666;
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
    name: "JfDatePicker",
    data() {
        return {
            currentPage1: 0,
            start:"",
            end:"",
            endDisabled:true
        };
    },
    props: {
        startPlaceholder:{
            type:String,
            default:"年/月/日"
        },
        endPlaceholder:{
            type:String,
            default:"年/月/日"
        },
    },
    watch:{
        start:{
            handler(value){
                // console.log(value)
                // this.$emit("childByValue",this.start);
                this.endDisabled = value?false:true
            }
        },
        end:{
            handler(value){
                this.$emit("childModel",[this.start,this.end])
            }
        }
    },
    mounted(){
        
    },
    methods: {
         change_end(e){
            console.log(e);
            
        }
    }
};
</script>