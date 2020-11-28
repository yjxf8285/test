<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:05:15
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/risk-manage/risk-case-query/risk-case-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">案例生成日期：</td>
                            <td style="width:400px;">
                                <el-date-picker
                                    v-model="start"
                                    size="mini"
                                    type="daterange"
                                    start-placeholder="请选择"
                                    end-placeholder="请选择"
                                    style="width:100%"
                                />
                            </td>
                            <td class="left">商户编号：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">单据状态：</td>
                            <td>
                                <el-select v-model="type" size="mini" style="width:100%">
                                    <el-option value="1" />
                                    <el-option value="1" />
                                    <el-option value="1" />
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="left">商户名称：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">超期未处理：</td>
                            <td>
                                <el-select v-model="type" size="mini" style="width:100%">
                                    <el-option value="是" />
                                    <el-option value="否" />
                                </el-select>
                            </td>
                        </tr>
                    </table>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>查询</el-button>
                        <el-button size="medium" style="margin-left:20px;">重置</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./risk-case-query.js"></script>
<style lang="scss" src="./risk-case-query.scss" scoped></style>
