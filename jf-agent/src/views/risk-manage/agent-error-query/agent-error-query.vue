<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:03:45
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/risk-manage/agent-error-query/agent-error-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">付款单号：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">商户编号：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">银行开户名称：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                        </tr>
                        <tr>
                            <td class="left">处理完成：</td>
                            <td>
                                <el-select size="mini" style="width:100%" value>
                                    <el-option value="可用" />
                                    <el-option value="不可用" />
                                </el-select>
                            </td>
                            <td class="left">创建时间：</td>
                            <td colspan="2">
                                <el-date-picker
                                    type="daterange"
                                    size="mini"
                                    style="width:100%"
                                    start-placeholder="请选择"
                                    end-placeholder="请选择"
                                />
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

<script src="./agent-error-query.js"></script>
<style lang="scss" src="./agent-error-query.scss" scoped></style>
