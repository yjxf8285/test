<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:54:12
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/account-cost-query/account-cost-query.vue
 -->
<template>
    <div class="perfer-merchant-import">
        <div class="jf-main-content">
            <div class="perfer-merchant-import-content">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="12" style="text-align:center">
                        登录手机号：
                        <el-input size="mini" style="width:200px" />
                    </el-col>
                    <el-col :span="12" style="text-align:center">
                        分支机构名称：
                        <el-input size="mini" style="width:200px" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./account-cost-query.scss" scoped>
</style>
<script src="./account-cost-query.js"></script>
