/*
 * @Author: wuyulong
 * @Date: 2019-12-25 17:33:12
 * @LastEditTime: 2020-05-07 14:43:18
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/common-setting/use-help/use-help.js
 */
export default {
    data() {
        return {
            formData:{
                keyWord:"",
                keyWord2:""
            },
            rules:{
                keyWord:[{
                    max:50,
                    message:"搜索内容超过50个字符"
                }]
            },
            activeName:1
        }
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    alert("submit!")
                }
                else{

                }
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields()
        }
    }
}
