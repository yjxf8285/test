<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:34:25
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/admin-apply-export/admin-apply-export.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="4" style="text-align:right">服务商编号：</el-col>
                    <el-col :span="8">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="4" style="text-align:right">导出类型：</el-col>
                    <el-col :span="8">
                        <el-select v-model="exportType" size="small">
                            <el-option value="商户导出" />
                            <el-option value="分支机构分润导出" />
                        </el-select>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="4" style="text-align:right">申请人：</el-col>
                    <el-col :span="8">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="4" style="text-align:right">创建时间：</el-col>
                    <el-col :span="8">
                        <el-date-picker
                            v-model="createTime_start"
                            size="small"
                            placeholder="开始时间"
                            style="width:140px"
                        />—
                        <el-date-picker
                            v-model="createTime_end"
                            size="small"
                            placeholder="结束时间"
                            style="width:140px"
                        />
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>提交</el-button>
                    <el-button size="medium" style="margin-left:20px;">返回</el-button>
                    <el-button
                        type="warning"
                        size="medium"
                        style="margin-left:20px;"
                        plain
                        @click="visibleDialog=true"
                    >新增</el-button>
                </el-row>
            </div>
        </div>

        <el-dialog :visible.sync="visibleDialog" title="新增服务商导出限制">
            <div class="add-export">
                <el-form label-width="120px">
                    <el-form-item label="操作员登录名：">
                        <el-input placeholder="请输入操作员登录名" size="small" />
                    </el-form-item>
                    <el-form-item label="服务商编号：">
                        <el-input placeholder="请输入服务商编号" size="small" />
                    </el-form-item>
                    <el-form-item label="导出类型：">
                        <el-select v-model="exportType" size="small">
                            <el-option value="分支机构" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导出次数：">
                        <el-input v-model="exportNum" size="small" />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            size="medium"
                            type="primary"
                            plain
                            @click="visibleDialog=false"
                        >保存</el-button>
                        <el-button size="medium" @click="visibleDialog=false">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script src="./admin-apply-export.js"></script>
<style lang="scss" src="./admin-apply-export.scss" scoped></style>
