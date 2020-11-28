<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:55:04
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/sale-transfer-agent/sale-transfer-agent.vue
 -->
<template>
    <div class="roles-manage">
        <div class="jf-main-content">
            <div class="menu-manage-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2">功能提示：</el-col>
                    <el-col :span="12">
                        <i class="red">*</i> 服务商可将操作员或销售转换为分支机构角色。
                    </el-col>
                    <el-col :span="10">
                        登录名：
                        <el-input size="mini" style="width:200px" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>转换</el-button>
                    <el-button size="medium" style="margin-left:20px">取消</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./sale-transfer-agent.scss" scope>
</style>
<script src="./sale-transfer-agent.js"></script>
