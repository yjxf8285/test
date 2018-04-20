<style lang="scss" scope>
.bg {
  width: 100%;
  height: 100%;
  background: #fff url("../../../static/images/login_bg.png");
  background-size: cover;
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
}
.login-container {
  width: 280px;
  height: 340px;
  position: absolute;
  text-align: center;
  right: 15%;
  top: -25px;
  bottom: 0;
  margin: auto;
  border-radius: 5px;
  background-color: rgba(87, 102, 150, 0.3);
  box-shadow: 0px 0px 6px 2px #4c6096;
  transition: 0.5s all;
  opacity: 0;
  &.show {
    opacity: 1;
  }
  .login-logo {
    background: url(../../../static/images/login_logo.png);
    height: 100px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .login-info {
    position: relative;
  }
  .item {
    width: 80%;
    margin: 20px auto;
  }
  input[type="text"],
  input[type="password"] {
    border-radius: 5px;
  }
  .icon_user {
    background: url(../../../static/images/login_user.png);
    background-position: center;
    background-repeat: no-repeat;
  }
  .icon_pwd {
    background: url(../../../static/images/login_pwd.png);
    background-position: center;
    background-repeat: no-repeat;
  }
  .show-error {
    opacity: 1;
  }
  .el-input__inner {
    padding-left: 35px;
    padding-right: 35px;
  }
  .login {
    margin-top: 10px;
    border-radius: 5px;
    width: 100%;
    &.is-disabled {
      background-color: #4c6096;
      border: 1px solid #4c6096;
    }
  }
  .item:last-child {
    margin-top: 0px;
  }
  .el-form-item.isError {
    border: none;
  }
  .el-form-item__error {
    top: 105%;
  }

  .login-error {
    position: absolute;
    display: block;
    top: 90px;
    width: 100%;
    color: red;
    transition: 0.25s all;
    opacity: 0;
    font-size: 14px;
    font-size: 12px;
    &.show {
      opacity: 1;
    }
  }
  .el-input__icon {
    display: inline-block;
  }
  el-input__inner {
    outline: none;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-textarea__inner {
    border: none;
  }
}
</style>
<template>
  <div class="bg">
    <div class="login-container" ref="loginContainer">
    <div class="login-logo"></div>
    <span class="login-error" :class="{show: !!loginError}">
        {{loginError}}
      </span>
    <el-form :model="formData" status-icon :rules="formRule" ref="loginForm" >
      <div class="item">
        <el-form-item prop="username" ref="formItemUserName">
          <el-input
          auto-complete="off"
          ref="username"
          v-model="formData.username"
          placeholder="请输入用户名">
            <template slot="prefix">
              <i class="el-input__icon icon_user"></i>
            </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item prop="password"  ref="formItemPassword">
          <el-input
          auto-complete="off"
          ref="password"
          v-model="formData.password"
          placeholder="请输入密码"
          type="password">
          <template slot="prefix">
            <i class="el-input__icon icon_pwd"></i>
          </template>
            </el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-button
        ref="loginBtn"
        type="primary"
        class="login"
        @click="submitForm()"
        :loading="logining"
        :disabled="logining"
        >登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        <!-- <el-button class="registe">注&nbsp;&nbsp;&nbsp;&nbsp;册</el-button> -->
      </div>
     <!--  <div class="item">
        <a class="forget" href="#">忘记密码？</a>
      </div> -->
    </el-form>
    </div>
  </div>
</template>

<script>
import { Form, Button, Input, FormItem } from 'element-ui'
export default {
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem
  },
  data() {
    let that = this
    var validateUserName = (rule, value, callback) => {
      if (!value) {
        that.userNameValidated = false
        return callback(new Error('用户名不能为空'))
      }
      if (!/^[\u0391-\uFFE5\w]+$/.test(value)) {
        that.userNameValidated = false
        return callback(new Error('只允许汉字、英文字母、数字及下划线'))
      }
      that.userNameValidated = true
      callback()
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        that.passwordValidated = false
        callback(new Error('请输入密码'))
      } else {
        that.passwordValidated = true
        callback()
      }
    }
    return {
      redirectUrl: '',
      loginError: '',
      logining: false,
      formData: {
        username: '',
        password: ''
      },
      formRule: {
        username: [{ validator: validateUserName, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }]
      },
      userNameValidated: true,
      passwordValidated: true
    }
  },
  mounted() {
    let vm = this
    vm.$refs.username.$el.querySelector("input[type='text']").focus()
    vm.redirectUrl = vm.getRedirectUrl()
    vm.$refs.loginContainer.className =
      vm.$refs.loginContainer.className + ' show'
    window.addEventListener('keydown', this.onEnterKeyDown, false)
  },
  methods: {
    getRedirectUrl() {
      return this.$route.query.redirectUrl
        ? decodeURIComponent(this.$route.query.redirectUrl)
        : document.referrer ? document.referrer : ''
    },
    addTokenToRedirectUrl(url, token) {
      let link = document.createElement('a')
      link.href = url
      if (link.search.length > 0) {
        let queryStrings = link.search.substring(1).split('&')
        let replaced = false
        queryStrings.forEach(item => {
          if (item.startsWith('token=')) {
            item = 'token=' + token
            replaced = true
          }
        })
        if (!replaced) {
          link.search = link.search + '&token=' + token
        } else {
          link.search = '?' + queryStrings.join('&')
        }
      } else {
        link.search = '?token=' + token
      }
      return link.href
    },
    submitForm() {
      let vm = this
      vm.$refs.loginForm.validate(valid => {
        if (valid) {
          vm.login()
        } else {
          return false
        }
      })
    },
    login() {
      let vm = this
      vm.logining = true
      vm.loginError = ''
      vm.api
        .login({
          data: vm.formData
        })
        .then(function(responseData) {
          console.log(responseData)
          if (responseData.code !== 0) {
            vm.loginError = responseData.message
          } else {
            vm.loginError = ''
            if (vm.redirectUrl) {
              window.location.href = vm.addTokenToRedirectUrl(
                vm.redirectUrl,
                responseData.data.ticket
              )
            } else {
              window.location.href = vm.addTokenToRedirectUrl(
                '/',
                responseData.data.ticket
              )
            }
          }
        })
        .always(function() {
          vm.logining = false
        })
    },
    onEnterKeyDown(e) {
      let vm = this
      if (e.keyCode === 13) {
        vm.$refs.loginBtn.$el.click()
      }
    }
  },
  destroyed() {
    window.removeEventListener('keydown', this.onEnterKeyDown)
  }
}
</script>

