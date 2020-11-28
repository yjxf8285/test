<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:28:54
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/operator-manage/operator-manage.vue
 -->
<template>
    <div class="operator-manage">
        <div class="jf-main-content">
            <div class="operator-manage-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2">登录名称：</el-col>
                    <el-col :span="7">
                        <el-input v-model="loginName" size="mini" />
                    </el-col>
                    <el-col :span="6" />
                    <el-col :span="2">真实姓名：</el-col>
                    <el-col :span="7">
                        <el-input v-model="trueName" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="2">创建时间：</el-col>
                    <el-col :span="22">
                        <el-date-picker
                            v-model="startTime"
                            placeholder="开始时间"
                            size="mini"
                            style="width:150px"
                        />—
                        <el-date-picker
                            v-model="endTime"
                            placeholder="结束时间"
                            size="mini"
                            style="width:150px"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./operator-manage.scss" scoped>
</style>
<script src="./operator-manage.js"></script>
