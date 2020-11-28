<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:22
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/electron-contract-add/electron-contract-add.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form ref="form" :v-model="form" label-width="130px">
                    <el-form-item label="商户编号：">
                        <el-input v-model="agentNo" size="small" />
                    </el-form-item>

                    <el-form-item>
                        <el-button size="medium" type="primary" plain>提交</el-button>
                        <el-button size="medium">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script src="./electron-contract-add.js"></script>
<style lang="scss" src="./electron-contract-add.scss" scoped></style>
