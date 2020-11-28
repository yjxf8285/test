<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:33:25
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/login-journal-query/login-journal-query.vue
 -->
<template>
    <div class="login-journal-query">
        <div class="jf-main-content">
            <div class="login-journal-query-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2">用户名：</el-col>
                    <el-col :span="8">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                    <el-col :span="4" />
                    <el-col :span="2">登录状态：</el-col>
                    <el-col :span="8">
                        <el-select v-model="doResult" size="mini">
                            <el-option value="成功" />
                            <el-option value="失败" />
                        </el-select>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2">登录时间：</el-col>
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
                    <el-col :span="4" />
                    <el-col :span="2">登录IP：</el-col>
                    <el-col :span="8">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2">登出时间：</el-col>
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
                    <el-col :span="4" />
                    <el-col :span="2">SessionId：</el-col>
                    <el-col :span="8">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
                    <el-button type="primary" size="medium">查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./login-journal-query.scss" scoped>
</style>
<script src="./login-journal-query.js"></script>
