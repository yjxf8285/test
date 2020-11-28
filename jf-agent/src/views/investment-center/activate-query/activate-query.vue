<!--
 * @Author: wuyulong
 * @Date: 2020-02-20 13:11:13
 * @LastEditTime: 2020-02-21 16:44:39
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/investment-center/activate-query/activate-query.vue
 -->
<template>
    <div id="root">
        <div class="jf-main-content">
            <el-row type="flex" align="middle">
                <el-col :span="2">
                    品牌：
                </el-col>
                <el-col :span="4">点付</el-col>
                <el-col :span="2">
                    机构属性：
                </el-col>
                <el-col :span="4">
                    <el-select 
                        size="mini"
                        style="width:160px;"
                        value
                    >
                        <el-option value />
                    </el-select>
                </el-col>
                <el-col :span="2">机构编号：</el-col>
                <el-col :span="4">
                    <div>
                        <el-input style="width:160px;" size="mini" />
                    </div>
                </el-col>
                <el-col :span="2">机构名称：</el-col>
                <el-col :span="4">
                    <div>
                        <el-input style="width:160px;" size="mini" />
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="2">统计时间：</el-col>
                <el-col :span="10">
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="mini"
                    />
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="2">交易金额：</el-col>
                <el-col :span="10">
                    <el-input style="width:300px;" size="mini" />
                </el-col>

                <el-col :span="2">商户类型：</el-col>
                <el-col :span="10">
                    <el-select size="mini" value>
                        <el-option value />
                    </el-select>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="2">活动类型：</el-col>
                <el-col :span="10">
                    <el-select size="mini" value>
                        <el-option value />
                    </el-select>
                </el-col>
                <el-col :span="2">活动配置：</el-col>
                <el-col :span="10">
                    <el-select size="mini" value>
                        <el-option value />
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="margin-top:50px" type="flex" align="middle" justify="center">
                <el-button type="primary" size="medium">查询</el-button>
                <el-button size="medium">重置</el-button>
                <el-button size="medium">激活导出</el-button>
            </el-row>
        </div>
    </div>
</template>
<script src="./activate-query.js"></script>
<style lang="scss" src="./activate-query.scss" scoped></style>
