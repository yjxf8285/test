<!--
 * @Author: wuyulong
 * @Date: 2020-02-20 13:11:12
 * @LastEditTime: 2020-02-21 17:00:50
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/account-management/other-account-detail-query/other-account-detail-query.vue
 -->
<template>
    <div id="root">
        <div class="jf-main-content">
            <el-row type="flex" align="middle">
                <el-col :span="3">业务发生时间：</el-col>
                <el-col :span="10">
                    <el-date-picker
                    v-model="dateOfOccurrence"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    size="mini"
                />
                </el-col>
                <el-col :span="2">资金方向：</el-col>
                <el-col :span="9">
                    <el-select v-model="directionOfMoney" size="mini">
                        <el-option
                            v-for="(item,index) in directionOfMoneyOptions"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-col>
            </el-row>
        <div class="footer">
            <div>
                <el-button type="primary" size="medium">查询</el-button>
                <el-button size="medium">重置</el-button>
            </div>
        </div>
        </div>
    </div>
</template>
<script src="./other-account-detail-query.js"></script>
<style lang="scss" src="./other-account-detail-query.scss" scoped></style>
