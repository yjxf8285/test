<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:01
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/industry-change-apply/industry-change-apply.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="perfer-merchant-import-header">
                    <span />
                    服务商工商变更
                </div>

                <div class="agent-change">
                    <h1 class="red">重要提示：如果您的企业名称或法人发生变更，审核通过后对应的结算卡开户名将会同时变更，请前往账户管理-我的结算卡下修改账号和开户行</h1>
                    <div class="agent-change-content">
                        <div class="agent-change-left">
                            <table>
                                <tr>
                                    <td colspan="2" style="text-align:center">原始信息：</td>
                                </tr>
                                <tr>
                                    <td>原企业名称：</td>
                                    <td>自动化测试代理商入网18547227889</td>
                                </tr>
                                <tr>
                                    <td>原营业执照号：</td>
                                    <td>1233453535</td>
                                </tr>
                                <tr>
                                    <td>原法人姓名：</td>
                                    <td>杨荫利</td>
                                </tr>
                                <tr>
                                    <td>原法人身份证号：</td>
                                    <td>130406199006012134</td>
                                </tr>
                                <tr>
                                    <td>原法人身份证地址：</td>
                                    <td>北京市测试</td>
                                </tr>
                                <tr>
                                    <td>原注册地址：</td>
                                    <td>北京市测试</td>
                                </tr>
                                <tr>
                                    <td>原注册资本：</td>
                                    <td>1000000</td>
                                </tr>
                                <tr>
                                    <td>原公司类型：</td>
                                    <td>个体户</td>
                                </tr>
                                <tr>
                                    <td>原成立日期：</td>
                                    <td>2008-04-10</td>
                                </tr>
                                <tr>
                                    <td>原营业期限：</td>
                                    <td>2008.10.1至2028.10.1</td>
                                </tr>
                                <tr>
                                    <td>原组织机构代码：</td>
                                    <td>12345453536</td>
                                </tr>
                                <tr>
                                    <td>原税务登记证号：</td>
                                    <td>123445353</td>
                                </tr>
                                <tr>
                                    <td>原经营范围：</td>
                                    <td>
                                        <textarea id name />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="agent-change-right">
                            <table>
                                <tr>
                                    <td colspan="2" style="text-align:center">变更后信息</td>
                                </tr>
                                <tr>
                                    <td>新企业名称：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新营业执照号：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新法人姓名：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新法人身份证号：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新法人身份证地址：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新注册地址：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新注册资本：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新公司类型：</td>
                                    <td>
                                        <el-select v-model="agentId" size="mini">
                                            <el-option value="企业有限公司" />
                                            <el-option value="个体户" />
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>新成立日期：</td>
                                    <td>
                                        <el-date-picker
                                            v-model="agentId"
                                            placeholder="请选择"
                                            size="mini"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>原营业期限：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>原组织机构代码：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>原税务登记证号：</td>
                                    <td>
                                        <el-input v-model="agentId" size="mini" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>新经营范围：</td>
                                    <td>
                                        <textarea id v-model="agentId" name />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="perfer-merchant-import-header">
                    <span />
                    资质信息
                </div>

                <div class="qualification-info">
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">新营业执照图片：</el-col>
                        <el-col :span="20">
                            <el-input type="file" size="mini" />
                            <i class="red">*</i>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">工商变更登记表：</el-col>
                        <el-col :span="20">
                            <el-input type="file" size="mini" />
                            <i class="red">*</i>
                            <a href="javascript:;" @click="visibleDialog_login=true">样例</a>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">工商变更申请表：</el-col>
                        <el-col :span="20">
                            <el-input type="file" size="mini" />
                            <i class="red">*</i>
                            <a href="javascript:;" @click="visibleDialog_apply=true">样例</a>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">法人身份证正面图片：</el-col>
                        <el-col :span="20">
                            <el-input type="file" size="mini" />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">法人身份证背面图片：</el-col>
                        <el-col :span="20">
                            <el-input type="file" size="mini" />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="4" class="right">说明：</el-col>
                        <el-col :span="20">1. 请使用jpeg或jpg格式文件上传，单个上传文件不能大于300K</el-col>
                    </el-row>
                </div>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>提交</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>

        <el-dialog :visible.sync="visibleDialog_login" title>
            <div class="business-change-dialog">
                <img src="@/assets/A019ChangeReg.jpg" alt />
            </div>
        </el-dialog>

        <el-dialog :visible.sync="visibleDialog_apply" title>
            <div class="business-change-dialog">
                <img src="@/assets/A019Apply.jpg" alt />
            </div>
        </el-dialog>
    </div>
</template>

<script src="./industry-change-apply.js"></script>
<style lang="scss" src="./industry-change-apply.scss" scoped></style>
