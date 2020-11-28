<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:02:29
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/finance-manage/violate-customer-query/violate-customer-query.vue
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
                                <el-input v-model="defaultFee" size="mini" />
                            </td>
                            <td class="left">商户名称：</td>
                            <td>
                                <el-input v-model="defaultFee" size="mini" />
                            </td>
                            <td class="left">发起时间：</td>
                            <td>
                                <el-date-picker
                                    v-model="examineTime"
                                    type="daterange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    size="mini"
                                    style="width:230px"
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

<script src="./violate-customer-query.js"></script>
<style lang="scss" src="./violate-customer-query.scss" scoped></style>
