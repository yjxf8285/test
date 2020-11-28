<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:57:36
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-pos-send/ishua-pos-send.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2" class="right">商户编号：</el-col>
                    <el-col :span="6">
                        <el-input v-model="type" size="small" />
                    </el-col>
                    <el-col :span="2" class="right">手机号：</el-col>
                    <el-col :span="6">
                        <el-input v-model="type" size="small" />
                    </el-col>
                    <el-col :span="2" class="right">发货状态：</el-col>
                    <el-col :span="6">
                        <el-select v-model="type" size="small">
                            <el-option value="全部" />
                            <el-option value="未发货" />
                            <el-option value="已发货" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="2" class="right">时间筛选：</el-col>
                    <el-col :span="22">
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

<script src="./ishua-pos-send.js"></script>
<style lang="scss" src="./ishua-pos-send.scss" scoped></style>
