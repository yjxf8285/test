<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-05-06 17:05:11
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/perfer-merchant-import/perfer-merchant-import.vue
 -->
<template>
    <div class="perfer-merchant-import">
        <div class="jf-main-content">
            <div class="perfer-merchant-import-content">
                <div class="perfer-merchant-import-header">
                    <span />
                    优惠商户批量导入开通
                </div>

                <el-row type="flex" align="middle">
                    <el-col :span="2">上传文件</el-col>
                    <el-col :span="22">
                        <jf-upload-excel :fileList="fileList" @handleSuccess="handleSuccess"></jf-upload-excel>
                    </el-col>
                </el-row>
                <!-- <el-row type="flex" align="middle">
                    <el-col :span="2" />
                    <el-col :span="22" class="red">优惠商户导入文件不能大于5000行！</el-col>
                </el-row> -->
                <el-row type="flex" align="middle" justify="center" style="margin-bottom:70px;">
                    <el-button type="primary" size="medium">批量导入</el-button>
                </el-row>

                <div class="perfer-merchant-import-header">
                    <span />
                    优惠商户导入结果
                </div>

                <el-row type="flex" align="middle">
                    <el-col :span="2">营业执照号</el-col>
                    <el-col :span="8">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                    <el-col :span="4" />
                    <el-col :span="2">操作时间</el-col>
                    <el-col :span="8">
                        <el-date-picker
                            v-model="doStart"
                            size="mini"
                            style="width:130px"
                            placeholder="开始时间"
                        />—
                        <el-date-picker
                            v-model="doEnd"
                            size="mini"
                            style="width:130px"
                            placeholder="结束时间"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="2">操作结果</el-col>
                    <el-col :span="22">
                        <el-select v-model="doResult" size="mini">
                            <el-option value="成功" />
                            <el-option value="失败" />
                        </el-select>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
                    <el-button @click="submitInfo()" type="primary" size="medium">查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>

                <jf-table :tableData="tableData" :columns="columns" :loading="loading" :pageObj="pageObj">
                    <el-table-column slot="operate" label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button size="small" type="warning"
                                    icon='el-icon-edit'
                                    @click="edit(scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="primary"
                                    icon='el-icon-success'
                                    @click="startUsing(scope.row)">启用
                            </el-button>          
                        </template>
                    </el-table-column>
                </jf-table>

            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./perfer-merchant-import.scss" scoped>
</style>
<script src="./perfer-merchant-import.js"></script>
