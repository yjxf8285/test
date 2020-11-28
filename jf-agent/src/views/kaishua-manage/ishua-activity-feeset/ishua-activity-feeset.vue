<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:55:49
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-activity-feeset/ishua-activity-feeset.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-tabs type="border-card">
                    <el-tab-pane label="i刷2.0活动">
                        <h1>I刷2.0活动机具费率设置</h1>
                        <div class="form">
                            <table>
                                <tr>
                                    <td class="left">服务商编号：</td>
                                    <td>8624724627</td>
                                    <td class="left">服务商名称：</td>
                                    <td>自动化测试代理商入网18547227889</td>
                                </tr>
                                <tr>
                                    <td class="left">默认费率：</td>
                                    <td>
                                        <el-input v-model="defaultFee" size="mini" />
                                    </td>
                                    <td class="left">费率说明：</td>
                                    <td>费率范围：0.0055-0.0062</td>
                                </tr>
                            </table>
                        </div>
                        <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                            <el-button size="medium" type="primary" plain>保存</el-button>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="i刷1.0活动">
                        <h1>I刷1.0活动机具费率设置</h1>
                        <div class="form">
                            <table>
                                <tr>
                                    <td class="left">服务商编号：</td>
                                    <td>8624724627</td>
                                    <td class="left">服务商名称：</td>
                                    <td>自动化测试代理商入网18547227889</td>
                                </tr>
                                <tr>
                                    <td class="left">默认费率：</td>
                                    <td>
                                        <el-input v-model="defaultFee" size="mini" />
                                    </td>
                                    <td class="left">费率说明：</td>
                                    <td>费率范围：0.0055-0.0062</td>
                                </tr>
                            </table>
                        </div>
                        <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                            <el-button size="medium" type="primary" plain>保存</el-button>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="i刷MPOS回馈">
                        <h1>MPOS回馈活动机具费率设置</h1>
                        <div class="form">
                            <table>
                                <tr>
                                    <td class="left">服务商编号：</td>
                                    <td>8624724627</td>
                                    <td class="left">服务商名称：</td>
                                    <td>自动化测试代理商入网18547227889</td>
                                </tr>
                                <tr>
                                    <td class="left">默认费率：</td>
                                    <td>
                                        <el-input v-model="defaultFee" size="mini" />
                                    </td>
                                    <td class="left">费率说明：</td>
                                    <td>费率范围：0.0055-0.0062</td>
                                </tr>
                            </table>
                        </div>
                        <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                            <el-button size="medium" type="primary" plain>保存</el-button>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script src="./ishua-activity-feeset.js"></script>
<style lang="scss" src="./ishua-activity-feeset.scss" scoped></style>
