/*
 * @Author: wuyulong
 * @Date: 2019-12-25 17:33:12
 * @LastEditTime: 2020-05-11 17:01:58
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/modify-password/modify-password.js
 */

const validatePassword = (rule, value, callback) => {
    let pattern = /[\u4e00-\u9fa5\s]+/
    if (value.length < 6) {
        callback(
            new Error("密码长度为6-16位")
        );
    } else if (pattern.test(value)) {
        callback(
            new Error("密码为字母、数字、字符任意两种类型组合")
        );
    } else {
        callback();
    }
};

export default {
    data() {
        return {
            formObj:{
                account:"18925611654",
                old_password:"kdb@7654",
                new_password:"",
                new_password_confirm:""
            },
            rules:{
                new_password:[{
                    required:true,
                    // message:"请输入新密码",
                    validator: validatePassword
                }],
                new_password_confirm:[{
                    required:true,
                    // message:"请输入确认新密码",
                    validator: validatePassword
                }]
            },
            passwordType1:'password',
            passwordType2:'password'
        }
    },
    methods: {
        showPwd(n){
            if(this['passwordType'+n]=="password"){
                this['passwordType'+n] = "";
            }
            else{
                this['passwordType'+n] = "password";
            }
        },
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){

                    console.log(this.formObj);
                    if(this.formObj.new_password!==this.formObj.new_password_confirm){
                        this.$message({
                            type: 'error',
                            message: "两次密码输入不一致"
                          });
                        return;
                    }

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
