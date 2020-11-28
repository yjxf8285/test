<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:58:09
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-recommend-query/ishua-recommend-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="7" style="text-align:center">
                        手机号：
                        <el-input v-model="type" size="small" />
                    </el-col>
                    <el-col :span="8" style="text-align:center">
                        商户编号：
                        <el-input v-model="type" size="small" />
                    </el-col>
                    <el-col :span="9" style="text-align:center">
                        注册时间：
                        <el-date-picker
                            v-model="start"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            size="small"
                            style="width:235px"
                            type="daterange"
                        />
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

<script src="./ishua-recommend-query.js"></script>
<style lang="scss" src="./ishua-recommend-query.scss" scoped></style>
