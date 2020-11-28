<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-05-11 17:14:54
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/login-daily-record/login-daily-record.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form :model="formObj" ref="formObj" :rules="rule" label-position="right" label-width="120px">
                    <el-row type="flex" align="middle" :gutter="5">
                        <el-col :span="7" class="right">
                            <el-form-item label="登录账号：" prop="loginAccount">
                                <el-input v-model="formObj.loginAccount" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="登录IP：" prop="ip">
                                <el-input v-model="formObj.ip" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="登录时间：" prop="date">
                                <jf-date-picker
                                    @childModel="childModel"
                                >
                                </jf-date-picker>
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

<script src="./login-daily-record.js"></script>
<style lang="scss" src="./login-daily-record.scss" scoped></style>
