<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:55:29
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-activity-customer-feeset/ishua-activity-customer-feeset.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <!-- <h1>I刷2.0活动机具费率设置</h1> -->
                    <table>
                        <tr>
                            <td class="left">修改费率信息：</td>
                            <td>
                                <el-upload action="##">
                                    <el-button type="primary" size="mini">点击上传</el-button>
                                </el-upload>
                            </td>
                            <td class="left">标准模板下载：</td>
                            <td>
                                <el-button type="primary" size="mini" plain>标准模板下载</el-button>
                            </td>
                        </tr>
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
                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>保存</el-button>
                    </el-row>
                </div>

                <div class="form">
                    <h1>批量修改费率结果</h1>
                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>查询</el-button>
                    </el-row>
                </div>

                <div class="form">
                    <h1>商户修改费率查询</h1>
                    <table>
                        <tr>
                            <td class="left">商户编号：</td>
                            <td>
                                <el-input v-model="defaultFee" style="width:300px;" size="mini" />
                            </td>
                            <!-- <td class="left">标准模板下载：</td>
                            <td>
                                <el-button type="primary" size="mini" plain>标准模板下载</el-button>
                            </td>-->
                        </tr>
                    </table>
                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>查询</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./ishua-activity-customer-feeset.js"></script>
<style lang="scss" src="./ishua-activity-customer-feeset.scss" scoped></style>
