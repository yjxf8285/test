<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:57:20
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-pos-query/ishua-pos-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="5" style="text-align:right">序列号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="type" size="small" />
                    </el-col>
                    <el-col :span="5" style="text-align:right">商户编号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="type" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="5" style="text-align:right">状态：</el-col>
                    <el-col :span="7">
                        <el-select v-model="type" size="small">
                            <el-option value="全部" />
                        </el-select>
                    </el-col>
                    <el-col :span="5" style="text-align:right">活动类型：</el-col>
                    <el-col :span="7">
                        <el-select v-model="type" size="small">
                            <el-option value="全部" />
                        </el-select>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="5" style="text-align:right">开刷手机号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="type" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                    <el-button
                        type="warning"
                        size="medium"
                        style="margin-left:20px;"
                        plain
                        @click="visibleDialog=true"
                    >批量变更机具活动配置</el-button>
                    <el-button size="medium" style="margin-left:20px;">活动机具导出</el-button>
                </el-row>
            </div>
        </div>

        <el-dialog :visible.sync="visibleDialog" title="批量变更机具活动配置">
            <div class="batch-change-config">
                <el-form>
                    <el-form-item>
                        <el-row type="flex" align="middle">
                            <el-col :span="5" class="grey">品牌：</el-col>
                            <el-col :span="7">开刷</el-col>
                            <el-col class="grey" :span="6">活动名称：</el-col>
                            <el-col :span="6">
                                <el-select v-model="type" size="mini">
                                    <el-option value="123" />
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item>
                        <el-row type="flex" align="middle">
                            <el-col :span="5" class="grey">费率：</el-col>
                            <el-col :span="7">
                                <el-input v-model="type" size="mini" />
                            </el-col>
                            <el-col class="grey" :span="6">费率区间：</el-col>
                            <el-col :span="6">0.0050 - 0.0080</el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item>
                        <el-row type="flex" align="middle">
                            <el-col :span="5" class="grey">D0提现手续费：</el-col>
                            <el-col :span="7">
                                <el-select v-model="type" size="mini">
                                    <el-option value="123" />
                                </el-select>
                            </el-col>
                            <el-col class="grey" :span="6">D0提现手续费区间：</el-col>
                            <el-col :span="6">0 - 3</el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item>
                        <el-row type="flex" align="middle">
                            <el-col :span="5" class="grey">系统接入费 - 返现金额：</el-col>
                            <el-col :span="7">
                                <el-input size="mini" />
                            </el-col>
                            <el-col class="grey" :span="6">变更机具活动配置-机具信息：</el-col>
                            <el-col :span="6">
                                <el-input type="file" size="mini" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain @click="visibleDialog=false">提交</el-button>
                    <el-button
                        size="medium"
                        style="margin-left:20px;"
                        @click="visibleDialog=false"
                    >导出失败明细</el-button>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script src="./ishua-pos-query.js"></script>
<style lang="scss" src="./ishua-pos-query.scss" scoped></style>
