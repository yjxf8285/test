<!--
 * @Author: wuyulong
 * @Date: 2020-02-20 13:11:13
 * @LastEditTime: 2020-02-21 16:21:14
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/investment-center/machine-allot/machine-allot.vue
 -->
<template>
    <div id="root">
        <!-- <div class="header">
      <div class="jf-main-title">
        <i class="el-icon-search" />
        机具划拨记录查询
      </div>
        </div>-->
        <div class="jf-main-content">
            <el-row type="flex" align="middle">
                <el-col :span="2.5">
                    原服务商编号：
                </el-col>
                <el-col :span="9">
                    <div>
                        <el-input size="mini" />
                    </div>
                </el-col>
                <el-col :span="2.5">
                    原服务商名称：
                </el-col>
                <el-col :span="9">
                    <div>
                        <el-input size="mini" />
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="2.5">
                    新服务商编号：
                </el-col>
                <el-col :span="9">
                    <div>
                        <el-input size="mini" />
                    </div>
                </el-col>
                <el-col :span="2.5">
                    新服务商名称：
                </el-col>
                <el-col :span="9">
                    <div>
                        <el-input size="mini" />
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="2.5">发起日期：</el-col>
                <el-col :span="9">
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
            <el-row type="flex" justify="center">
                <el-button size="medium" type="primary">查询</el-button>
                <el-button size="medium">重置</el-button>
            </el-row>
        </div>
    </div>
</template>
<script src="./machine-transfer.js"></script>
<style lang="scss" src="./machine-transfer.scss" scoped></style>
