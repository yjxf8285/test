<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:56:28
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-cashback-census/ishua-cashback-census.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="5" class="right">销售单号：</el-col>
                    <el-col :span="19">
                        <el-input v-model="type" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex">
                    <el-col :span="5" class="right">*返现统计及明细下载说明：</el-col>
                    <el-col :span="19">
                        <p class="red">1.系统每日7点核算激活的商户与机具数，数据存入缓存，次日7点之前下载数据不会更新；</p>
                        <p class="red">2.核算机具激活仅核算当前绑定状态的机具，绑定状态且交易额累计大于1000元激活数+1，解绑机具激活数-1；</p>
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

<script src="./ishua-cashback-census.js"></script>
<style lang="scss" src="./ishua-cashback-census.scss" scoped></style>
