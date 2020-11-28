/*
 * @Author: wuyulong
 * @Date: 2019-12-25 17:33:12
 * @LastEditTime: 2020-05-07 11:59:51
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/common-setting/feedBack/feedBack.js
 */
export default {
    data() {
        return {
            ruleForm: {
                value: ''
            },
            rules: {
                value: [
                    { required: true, message: '请输入意见内容', trigger:"blur"},
                    { min: 5, max: 300, message: '请输入5-300位文字', trigger:"change"}
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
