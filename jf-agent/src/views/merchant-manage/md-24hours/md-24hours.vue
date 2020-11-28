<!--
 * @Author: wuyulong
 * @Date: 2019-12-26 13:51:51
 * @LastEditTime: 2020-02-21 15:36:12
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/merchant-management/md-24hours/md-24hours.vue
 -->
<template>
    <div class="md-24hours">
        <div class="jf-main-content">
            <div class="md-24hours-content">
                <div class="md-24hours-row">
                    <div class="item">
                        <span>商户编号</span>
                        <i>
                            <el-input size="small" v-model="customerNo" style="width:160px" />
                        </i>
                    </div>

                    <div class="item">
                        <span>开通时间</span>
                        <i>
                            <el-date-picker
                                size="small"
                                v-model="beginDate"
                                type="date"
                                placeholder="开始日期"
                                style="width:140px;margin-right:15px;"
                            />
                            <el-date-picker
                                size="small"
                                v-model="endDate"
                                type="date"
                                placeholder="结束日期"
                                style="width:140px"
                            />
                        </i>
                    </div>

                    <div class="item">
                        <span>审核状态</span>
                        <i>
                            <el-select size="small" v-model="applyState" placeholder="请选择">
                                <el-option value="待审核" />
                                <el-option value="审核通过" />
                                <el-option value="审核驳回" />
                            </el-select>
                        </i>
                    </div>
                </div>

                <div class="md-24hours-footer">
                    <el-button type="primary" size="medium">提交</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./md-24hours.scss">
</style>
<script src="./md-24hours.js"></script>
