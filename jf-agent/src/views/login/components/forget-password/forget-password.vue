<template>
  <div class="forget-content-form">
    <div class="forget-form-title">
      <svg-icon class="goback" icon-class="goback" @click="gobackLogin" />忘记密码
    </div>
    <el-form
      ref="forgetForm"
      :model="forgetForm"
      :rules="forgetRules"
      class="forget-form"
      autocomplete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="forgetForm.username"
          placeholder="请输入账户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="shield" />
        </span>
        <el-input
          ref="code"
          v-model="forgetForm.code"
          placeholder="验证码"
          name="code"
          type="text"
          tabindex="1"
          autocomplete="on"
          style="width:220px"
          maxlength="4"
        />
        <div
          class="sync-code"
          :class="{'blue':countDownNumber==60}"
          @click="getCode"
        >{{countDownNumber==60?"获取验证码":countDownNumber+"s"}}</div>
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="forgetForm.password"
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
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="checkpassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="checkpassword"
            v-model="forgetForm.checkpassword"
            :type="passwordType"
            placeholder="请再次输入密码"
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
      <el-button
        :loading="loading"
        type="primary"
        @click.native.prevent="submitForm('forgetForm')"
      >确定</el-button>
    </el-form>
  </div>
</template>
<script src="./forget-password.js"></script>
<style src="./forget-password.scss" lang="scss" scoped></style>