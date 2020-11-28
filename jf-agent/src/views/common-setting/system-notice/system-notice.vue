<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-05-11 09:40:36
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/system-notice/system-notice.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form :model="formObj" ref="formObj" :rules="rule" label-position="right" label-width="130px">
                    <el-row type="flex" align="middle" :gutter="5">
                        <el-col :span="12" class="right">
                            <el-form-item label="标题：" prop="title">
                                <el-input placeholder="请输入标题" size="mini" v-model="formObj.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发布日期：" prop="publishDate">
                                <jf-date-picker
                                    :formObj="formObj.publishDate"
                                    @childModel="childModel"
                                >
                                </jf-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- <el-date-picker
                        type="daterange"
                        v-model="test"
                        @change="hahaha"
                    > -->
                        
                    </el-date-picker>

                    <el-row type="flex" justify="center" style="margin:20px 0">
                        <el-button size="medium" type="primary" @click="submitForm('formObj')">查询</el-button>
                        <el-button size="medium" style="margin-left:20px;" @click="resetForm('formObj')">重置</el-button>
                    </el-row>

                </el-form>

                <jf-table :tableData="tableData" :columns="columns" :loading="tableLoading" :pageObj="pageObj">
                    <el-table-column slot="operate" label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                @click="watchNotice(scope.row)">查看
                            </el-button>        
                        </template>
                    </el-table-column>
                </jf-table>
 
            </div>
        </div>

        <el-dialog 
            title=""
            :visible.sync="showDetail"
            >
            <div class="system-notice">

                <h1>{{detailTitle}}</h1>

                <p>沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知</p>
                <p>沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知</p>
                <p>沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知沉默商户激活奖励活动通知</p>
            </div>
        </el-dialog>

    </div>
</template>

<script src="./system-notice.js"></script>
<style lang="scss" src="./system-notice.scss" scoped></style>
