import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";
import forgetPassword from "./components/forget-password/forget-password.vue"

export default {
    name: "Login", 
    components: { SocialSign,forgetPassword },
    data() {
        const validateUsername = (rule, value, callback) => {
            let pattern = /[^0-9]+/;
            if (pattern.test(value)) {
                callback(new Error("不可输入空格、字母、汉字、特殊字符"));
                // callback();
            } else {
                // console.log("执行规则")
                callback();
            }
            // if (!validUsername(value)) {
            //     callback(new Error("Please enter the correct user name"));
            // } else {
            //     callback();
            // }
        };
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
        const validateCode = (rule, value, callback) => {
            let pattern = /[^a-zA-Z0-9]+/
            if (pattern.test(value)) {
                callback(
                    new Error("只可输入字母或者字母数字组合")
                );
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "admin",
                password: "111111",
                code: ""
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    //验证是否符合规范 不可输入空格、字母、汉字、特殊字符
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateUsername
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validatePassword
                    }
                ],
                code: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateCode
                    }
                ]
            },
            passwordType: "password",
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {},
            forgetPasswordShow:true
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true
        }
    },
    created() {
        // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
        if (this.loginForm.username === "") {
            this.$refs.username.focus();
        } else if (this.loginForm.password === "") {
            this.$refs.password.focus();
        }
    },
    destroyed() {
        // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
        checkCapslock(e) {
            const { key } = e;
            this.capsTooltip =
                key && key.length === 1 && key >= "A" && key <= "Z";
        },
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    console.log("开始登录")
                    this.$store
                    .dispatch("user/login", this.loginForm)
                    .then(() => {
                        this.$router.push({
                            path: this.redirect || "/",
                            query: this.otherQuery
                        });
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== "redirect") {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        }
        // afterQRScan() {
        //   if (e.key === 'x-admin-oauth-code') {
        //     const code = getQueryObject(e.newValue)
        //     const codeMap = {
        //       wechat: 'code',
        //       tencent: 'code'
        //     }
        //     const type = codeMap[this.auth_type]
        //     const codeName = code[type]
        //     if (codeName) {
        //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //         this.$router.push({ path: this.redirect || '/' })
        //       })
        //     } else {
        //       alert('第三方登录失败')
        //     }
        //   }
        // }
    }
};