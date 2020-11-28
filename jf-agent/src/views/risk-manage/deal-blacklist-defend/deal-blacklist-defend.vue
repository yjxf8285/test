<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:04:17
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/risk-manage/deal-blacklist-defend/deal-blacklist-defend.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">卡号：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">启用状态：</td>
                            <td>
                                <el-select v-model="type" size="mini" style="width:100%">
                                    <el-option value="1" />
                                    <el-option value="1" />
                                    <el-option value="1" />
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="left">生效日期：</td>
                            <td>
                                <el-date-picker
                                    v-model="start"
                                    size="mini"
                                    type="date"
                                    placeholder="请选择"
                                    style="width:100%"
                                />
                            </td>
                            <td class="left">失效日期：</td>
                            <td>
                                <el-date-picker
                                    v-model="end"
                                    size="mini"
                                    type="date"
                                    placeholder="请选择"
                                    style="width:100%"
                                />
                            </td>
                        </tr>
                    </table>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>查询</el-button>
                        <el-button size="medium" style="margin-left:20px;">重置</el-button>
                        <el-button
                            type="warning"
                            size="medium"
                            style="margin-left:20px;"
                            plain
                            @click="visibleDialog=true"
                        >新增</el-button>
                    </el-row>
                </div>
                <!-- 新增商户模块 -->
                <el-dialog :visible.sync="visibleDialog" title="黑名单-商户入网限制条件规则">
                    <div class="form">
                        <table>
                            <tr>
                                <td class="left">交易卡号：</td>
                                <td>
                                    <el-input v-model="type" size="mini" />
                                </td>
                                <td class="left">启用状态：</td>
                                <td>
                                    <el-select v-model="type" size="mini" style="width:100%">
                                        <el-option value="1" />
                                        <el-option value="1" />
                                        <el-option value="1" />
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="left">生效日期：</td>
                                <td>
                                    <el-date-picker
                                        v-model="start"
                                        size="mini"
                                        type="date"
                                        placeholder="请选择"
                                        style="width:100%"
                                    />
                                </td>
                                <td class="left">失效日期：</td>
                                <td>
                                    <el-date-picker
                                        v-model="end"
                                        size="mini"
                                        type="date"
                                        placeholder="请选择"
                                        style="width:100%"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td class="left">说明：</td>
                                <td colspan="2">
                                    <el-input type="textarea" />
                                </td>
                                <td class="red" style="font-size:12px;" />
                            </tr>
                        </table>

                        <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                            <el-button
                                size="medium"
                                type="primary"
                                plain
                                @click="visibleDialog=false"
                            >新增</el-button>
                            <el-button
                                size="medium"
                                style="margin-left:20px;"
                                @click="visibleDialog=false"
                            >重置</el-button>
                        </el-row>
                    </div>
                </el-dialog>

                <!-- 新增商户模块 -->
            </div>
        </div>
    </div>
</template>

<script src="./deal-blacklist-defend.js"></script>
<style lang="scss" src="./deal-blacklist-defend.scss" scoped></style>
