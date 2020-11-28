<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:58
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/admin-pos-delete/admin-pos-delete.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="5" style="text-align:right">POS序列号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="5" style="text-align:right">POS终端号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>提交</el-button>
                    <el-button size="medium" style="margin-left:20px;">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script src="./admin-pos-delete.js"></script>
<style lang="scss" src="./admin-pos-delete.scss" scoped></style>
