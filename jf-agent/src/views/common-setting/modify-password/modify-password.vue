<!--
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:55
 * @LastEditTime: 2020-05-11 17:03:21
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/modify-password/modify-password.vue
 -->
<template>
    <div class="feed-back">
        <div class="jf-main-content">
            <div class="modify-password">
                <el-form :model="formObj" ref="formObj" :rules="rules" label-position="left">
                    <el-form-item prop="account">
                        <span class="svg-container">
                            <svg-icon icon-class="user" />
                        </span>
                        <el-input v-model="formObj.account" placeholder="请输入账户名" size="small" disabled />
                    </el-form-item>
                    <el-form-item prop="old_password">
                        <span class="svg-container">
                            <svg-icon icon-class="password" />
                        </span>
                        <el-input type="text" v-model="formObj.old_password" placeholder="请输入原始密码" size="small" disabled/>
                        <span class="show-pwd">
                            <svg-icon icon-class="eye-open" />
                        </span>
                    </el-form-item>
                    <el-form-item prop="new_password">
                        <span class="svg-container">
                            <svg-icon icon-class="password" />
                        </span>
                        <el-input 
                            :type="passwordType1" 
                            v-model.trim="formObj.new_password" 
                            placeholder="请输入新密码" 
                            size="small"
                            minlength="6"
                            maxlength="16"
                        />
                        <span class="show-pwd" @click="showPwd(1)">
                            <svg-icon :icon-class="passwordType1 === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                    </el-form-item>
                    <el-form-item prop="new_password_confirm">
                        <span class="svg-container">
                            <svg-icon icon-class="password" />
                        </span>
                        <el-input 
                            :type="passwordType2" v-model.trim="formObj.new_password_confirm" 
                            placeholder="请输入确认新密码" 
                            size="small"
                            minlength="6"
                            maxlength="16"
                        />
                        <span class="show-pwd" @click="showPwd(2)">
                            <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                    </el-form-item>
                    
                </el-form>
                
                <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                    <el-button size="medium" type="primary" @click="submitForm('formObj')">确认</el-button>
                        <el-button size="medium" style="margin-left:20px;" @click="resetForm('formObj')">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./modify-password.scss" scoped>
</style>
<script src="./modify-password.js"></script>
