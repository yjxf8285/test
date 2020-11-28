<!--
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:55
 * @LastEditTime: 2020-05-07 17:48:04
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/feed-back/feed-back.vue
 -->
<template>
    <div class="feed-back">
        <div class="jf-main-content">
            <div class="feed-back-content">
                <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    :rules="rules"
                    label-position="right"
                    label-width="120"
                    :inline="true"
                >
                    <el-row type="flex"  align="middle" justify="center">
                        <!-- <el-col> -->
                            <span>意见内容：</span>
                            <div class="textArea">
                                <el-form-item label="" prop="value">
                                    <el-input placeholder="请输入5-300位文字" v-model="ruleForm.value" maxlength="300" type="textarea" />
                                </el-form-item>
                                <i>{{ruleForm.value.length}} / 300</i>
                            </div>
                        <!-- </el-col> -->
                    </el-row>

                    <el-row type="flex" justify="center" style="margin-top:50px">
                        <el-button type="primary" size="medium" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button size="medium" @click="resetForm('ruleForm')" style="margin-left:20px">重置</el-button>
                    </el-row>

                </el-form>
                
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./feed-back.scss" scoped>
</style>
<script src="./feed-back.js"></script>
