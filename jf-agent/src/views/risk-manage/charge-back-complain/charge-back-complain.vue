<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:04:01
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/risk-manage/charge-back-complain/charge-back-complain.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">商户编号：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                            <td class="left">商户名称：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                        </tr>
                        <tr>
                            <td class="left">交易金额(区间)：</td>
                            <td>
                                <el-input v-model="type" style="width:110px" size="mini" />—
                                <el-input v-model="type" style="width:110px" size="mini" />
                            </td>
                            <td class="left">交易卡号(后四位)：</td>
                            <td>
                                <el-input v-model="type" size="mini" />
                            </td>
                        </tr>
                        <tr>
                            <td class="left">交易时间(区间)：</td>
                            <td>
                                <el-date-picker
                                    type="daterange"
                                    size="mini"
                                    style="width:100%"
                                    start-placeholder="请选择"
                                    end-placeholder="请选择"
                                />
                            </td>
                            <td class="left">退单创建时间(区间)：</td>
                            <td>
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

<script src="./charge-back-complain.js"></script>
<style lang="scss" src="./charge-back-complain.scss" scoped></style>
