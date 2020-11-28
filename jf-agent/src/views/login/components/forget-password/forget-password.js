export default {
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
      let pattern = /[\u4e00-\u9fa5\s]+/;
      if (value.length < 6) {
        callback(new Error("密码长度为6-16位"));
      } else if (pattern.test(value)) {
        callback(new Error("密码为字母、数字、字符任意两种类型组合"));
      } else {
        if (value !== "") {
          this.$refs.forgetForm.validateField("checkpassword");
        }
        callback();
      }
    };
    var validatePassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.forgetForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      let pattern = /[^a-zA-Z0-9]+/;
      if (pattern.test(value)) {
        callback(new Error("只可输入字母或者字母数字组合"));
      } else {
        callback();
      }
    };
    return {
      forgetForm: {
        username: "",
        password: "",
        checkpassword: "",
        code: ""
      },
      forgetRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
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
        checkpassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword2
          }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            required: true,
            trigger: "blur",
            validator: validateCode
          }
        ]
      },
      capsTooltip: false,
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      countDownNumber: 60
    };
  },
  methods: {
    //返回登录框
    gobackLogin() {
      this.$emit("update:forgetPasswordShow", true);
    },
    //获取验证码
    getCode() {
      let _this = this;
      //发送请求
      if (this.countDownNumber == 60) {
        //倒计时
        this.countDown();
      }
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
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
    countDown() {
      this.getCodeState = 1;
      let _this = this;
      let cd = setInterval(function () {
        _this.countDownNumber -= 1;
        if (_this.countDownNumber == 0) {
          _this.countDownNumber = 60;
          clearInterval(cd);
        }
      }, 1000);
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("提交成功");
          this.$emit("update:forgetPasswordShow", true);
        } else {
          console.log(valid);
        }
      });
    }
  }
};