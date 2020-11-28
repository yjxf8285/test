<!--
 * @Author: wuyulong
 * @Date: 2019-12-26 14:50:26
 * @LastEditTime: 2020-02-21 15:38:34
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/merchant-management/merchant-batch-change/merchant-batch-change.vue
 -->
<template>
    <div class="merchant-batch-change">
        <div class="jf-main-content">
            <div class="merchant-batch-content">
                <el-row>
                    <el-col :span="12">
                        <el-row type="flex" justify="center" align="middle">
                            <el-col :span="4" style="font-size:14px;">产品名称</el-col>
                            <el-col>
                                <el-select size="small" v-model="productName">
                                    <el-option value="全部" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row type="flex" justify="center" align="middle">
                            <el-col :span="4" style="font-size:14px;">商户名称</el-col>
                            <el-col :span="20">
                                <el-select size="small" v-model="doState">
                                    <el-option value="全部" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-row type="flex" justify="center" align="middle">
                            <el-col :span="4" style="font-size:14px;">操作类型</el-col>
                            <el-col>
                                <el-select size="small" v-model="doType">
                                    <el-option value="全部" />
                                    <el-option value="开通" />
                                    <el-option value="修改" />
                                    <el-option value="关闭" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row type="flex" justify="center" align="middle">
                            <el-col :span="4" style="font-size:14px;">操作时间</el-col>
                            <el-col :span="20">
                                <el-date-picker
                                    v-model="doBeginDate"
                                    type="date"
                                    placeholder="开始时间"
                                    style="width:45%; margin-right:4%"
                                    size="small"
                                />
                                <el-date-picker
                                    v-model="doBeginEnd"
                                    type="date"
                                    placeholder="结束时间"
                                    style="width:45%"
                                    size="small"
                                />
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <div class="merchant-batch-footer">
                <el-button type="primary" size="medium" @click="queryCustomer()">查询</el-button>
                <el-button size="medium" style="margin-left:20px;">重置</el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./merchant-batch-change.scss" scoped></style>
<script src="./merchant-batch-change.js"></script>
