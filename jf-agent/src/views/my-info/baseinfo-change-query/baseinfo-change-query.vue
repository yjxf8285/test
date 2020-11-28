<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:32
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/baseinfo-change-query/baseinfo-change-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" justify="center">
                    <el-col :span="12" style="text-align:center">
                        <span>流程实例ID：</span>
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="12" style="text-align:center">
                        <span>单据状态：</span>
                        <el-select v-model="billType" size="small">
                            <el-option value="待提交" />
                            <el-option value="待审核" />
                            <el-option value="完成" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" style="margin-top:50px;">
                    <el-button type="primary" size="medium" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script src="./baseinfo-change-query.js"></script>
<style lang="scss" src="./baseinfo-change-query.scss" scoped></style>
