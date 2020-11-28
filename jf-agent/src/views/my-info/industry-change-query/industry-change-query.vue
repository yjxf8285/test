<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:32:41
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/industry-change-query/industry-change-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="5" style="text-align:right">流程实例ID：</el-col>
                    <el-col :span="7">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="5" style="text-align:right">单据状态：</el-col>
                    <el-col :span="7">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script src="./industry-change-query.js"></script>
<style lang="scss" src="./industry-change-query.scss" scoped></style>
