<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:53:06
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/manage-account/manage-account.vue
 -->
<template>
    <div class="operator-manage">
        <div class="jf-main-content">
            <div class="operator-manage-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2">账户类型：</el-col>
                    <el-col :span="7">
                        <el-select v-model="accountType" size="mini">
                            <el-option value="分支机构" />
                            <el-option value="服务商操作员" />
                            <el-option value="销售" />
                        </el-select>
                    </el-col>
                    <el-col :span="6" />
                    <el-col :span="2">简称：</el-col>
                    <el-col :span="7">
                        <el-input v-model="trueName" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="2">联系人：</el-col>
                    <el-col :span="7">
                        <el-input v-model="loginName" size="mini" />
                    </el-col>
                    <el-col :span="6" />
                    <el-col :span="2">联系电话：</el-col>
                    <el-col :span="7">
                        <el-input v-model="trueName" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./manage-account.scss" scoped>
</style>
<script src="./manage-account.js"></script>
