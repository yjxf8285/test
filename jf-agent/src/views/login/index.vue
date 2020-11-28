<!--
 * @Author: wuyulong
 * @Date: 2020-02-11 18:01:26
 * @LastEditTime: 2020-03-03 17:20:40
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/login/index.vue
 -->
<template>
  <div class="login-container">
    <div class="login-header">
      <img src="./image/icon_logo@2x.png" alt />
      <span>服务商管理系统</span>
    </div>

    <div class="login-content-bg">
      <div class="login-content">
        <div class="login-content-form">
          <keep-alive>
            <div v-if="forgetPasswordShow">
              <div class="login-form-title">客户登录</div>
              <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
                autocomplete="on"
                label-position="left"
              >
                <el-form-item prop="username">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="请输入账户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    maxlength="11"
                  />
                </el-form-item>

                <el-tooltip
                  v-model="capsTooltip"
                  content="Caps lock is On"
                  placement="right"
                  manual
                >
                  <el-form-item prop="password">
                    <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="请输入密码"
                      name="password"
                      tabindex="2"
                      autocomplete="on"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                      @keyup.enter.native="handleLogin"
                      minlength="6"
                      maxlength="16"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>

                <el-form-item prop="code">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.code"
                    placeholder="验证码"
                    name="code"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    style="width:220px"
                    maxlength="4"
                  />
                  <div class="sync-code">动态码</div>
                </el-form-item>

                <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>

                <div class="forgetPassword">
                  <a href="javascript:;" @click="forgetPasswordShow=false">忘记密码</a>
                </div>

                <!-- <div style="position:relative">
                            <div class="tips">
                                <span>Username : admin</span>
                                <span>Password : any</span>
                            </div>
                            <div class="tips">
                                <span style="margin-right:18px;">Username : editor</span>
                                <span>Password : any</span>
                            </div>

                            <el-button
                                class="thirdparty-button"
                                type="primary"
                                @click="showDialog=true"
                            >Or connect with</el-button>
                </div>-->
              </el-form>
            </div>
            <forget-password v-else :forgetPasswordShow.sync="forgetPasswordShow"></forget-password>
          </keep-alive>
        </div>
      </div>
    </div>

    <!-- <el-dialog title="Or connect with" :visible.sync="showDialog">
            Can not be simulated on local, so please combine you own business simulation! ! !
            <br />
            <br />
            <br />
            <social-sign />
    </el-dialog>-->

    <div class="login-footer">
      <p>
        <a href="##">帮助</a>
        <a href="##">隐私</a>
        <a href="##">条款</a>
      </p>
      <p>Copyright © 2012 - . All Rights Reserved 版权所有</p>
    </div>
  </div>
</template>

<script src="./login.js"></script>
<style lang="scss" src="./login.scss" scoped></style>
