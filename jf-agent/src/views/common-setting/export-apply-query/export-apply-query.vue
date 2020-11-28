<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-05-09 17:22:48
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/export-apply-query/export-apply-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form :model="formObj" ref="formObj" :rules="rule" label-position="right" label-width="130px">
                    <el-row type="flex" align="middle" :gutter="5">
                        <el-col :span="12" class="right">
                            <el-form-item label="导出类型：" prop="exportType">
                                <el-select v-model="formObj.exportType" size="mini">
                                    <el-option value="123" />
                                    <el-option value="123" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请时间：" prop="date">
                                <jf-date-picker></jf-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row type="flex" justify="center" style="margin:20px 0">
                        <el-button size="medium" type="primary" @click="submitForm('formObj')">查询</el-button>
                        <el-button size="medium" style="margin-left:20px;" @click="resetForm('formObj')">重置</el-button>
                    </el-row>

                </el-form>

                <jf-table :tableData="tableData" :columns="columns" :loading="tableLoading" :pageObj="pageObj">
                    <el-table-column slot="operate" label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                    @click="edit(scope.row)">下载
                            </el-button>        
                        </template>
                    </el-table-column>
                </jf-table>
 
            </div>
        </div>
    </div>
</template>

<script src="./export-apply-query.js"></script>
<style lang="scss" src="./export-apply-query.scss" scoped></style>
