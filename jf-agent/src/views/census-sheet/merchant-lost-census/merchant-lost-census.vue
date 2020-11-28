<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:45:50
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/census-sheet/merchant-lost-census/merchant-lost-census.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">请选无交易日期：</td>
                            <td>
                                <el-date-picker
                                    v-model="createTime"
                                    type="daterange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    size="mini"
                                    style="width:100%"
                                    :picker-options="pickerOptions"
                                />
                            </td>
                            <td class="left">请选有交易日期：</td>
                            <td>
                                <el-date-picker
                                    v-model="createTime2"
                                    type="daterange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    size="mini"
                                    style="width:100%"
                                    :picker-options="pickerOptions2"
                                />
                            </td>
                        </tr>
                    </table>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>查询</el-button>
                        <el-button size="medium" style="margin-left:20px;">重置</el-button>
                    </el-row>
                </div>

                <div class="query-total">
                    <el-row type="flex" align="middle" justify="center">
                        <!-- <el-col :span="4">合计：</el-col>
                        <el-col :span="5">交易总金额：0.0</el-col>
                        <el-col :span="5">交易总笔数：0.0</el-col>
                        <el-col :span="5">分润总金额：-- </el-col>-->
                        <el-col :span="5">
                            <el-button size="small" type="primary" plain>申请导出</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./merchant-lost-census.js"></script>
<style lang="scss" src="./merchant-lost-census.scss" scoped></style>
