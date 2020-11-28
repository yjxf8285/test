<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:51
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/admin-process-control/admin-process-control.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle">
                    <el-col :span="4" style="text-align:right">类型：</el-col>
                    <el-col :span="8">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                    <el-col :span="4" style="text-align:right">KEY：</el-col>
                    <el-col :span="8">
                        <el-input v-model="agentId" size="small" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="4" style="text-align:right">流程类型：</el-col>
                    <el-col :span="8">
                        <el-select v-model="exportType" size="small">
                            <el-option value="商户导出" />
                            <el-option value="分支机构分润导出" />
                        </el-select>
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

        <el-dialog :visible.sync="visibleDialog" title="流程控制添加">
            <div class="add-export">
                <el-form label-width="120px">
                    <el-form-item label="类型：">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select v-model="exportType" size="small">
                            <el-option value="可用" />
                            <el-option value="不可用" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="key：">
                        <el-input placeholder="请输入key" size="small" />
                    </el-form-item>
                    <el-form-item label="数据：">
                        <el-input type="textarea" size="small" />
                        <i class="red">*请多个数据之间用英文','分隔</i>
                    </el-form-item>
                    <el-form-item label="描述：">
                        <el-input type="textarea" size="small" />
                    </el-form-item>

                    <el-form-item style="margin-top:20px;">
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

<script src="./admin-process-control.js"></script>
<style lang="scss" src="./admin-process-control.scss" scoped></style>
