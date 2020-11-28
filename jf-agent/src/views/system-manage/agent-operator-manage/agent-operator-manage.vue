<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:55:54
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/agent-operator-manage/agent-operator-manage.vue
 -->
<template>
    <div class="operator-manage">
        <div class="jf-main-content">
            <div class="operator-manage-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2.5">登录名称：</el-col>
                    <el-col :span="7">
                        <el-input v-model="loginName" size="mini" />
                    </el-col>
                    <el-col :span="5" />
                    <el-col :span="2.5">服务商名称：</el-col>
                    <el-col :span="7">
                        <el-input v-model="trueName" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="2.5">服务商编号：</el-col>
                    <el-col :span="7">
                        <el-input v-model="agentNo" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>

                <div class="operator-manage-query">
                    <el-table :data="agentList" border>
                        <el-table-column label="登录名" prop="loginName" />
                        <el-table-column label="真实姓名" prop="trueName" width="70" />
                        <el-table-column width="250" label="服务商名称" prop="agentName" />
                        <el-table-column label="服务商编号" prop="agentNo" />
                        <el-table-column label="类型" prop="type" />
                        <el-table-column label="状态" prop="state" width="60" />
                        <el-table-column label="操作" width="210">
                            <a href="javascript:;" @click="resetPassword()">密码重置</a>
                            <a href="javascript:;" @click="open()">开通</a>
                            <a href="javascript:;" @click="rightManage()">权限管理</a>
                            <a href="javascript:;" @click="close()">关闭</a>
                        </el-table-column>
                    </el-table>

                    <div class="operator-manage-pagination">
                        <el-pagination
                            :page-size="10"
                            :total="1000"
                            layout="total,prev,pager,next"
                            style="text-align:center"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 权限修改 -->
        <el-dialog title="修改操作员" :visible.sync="visibleDialog">
            <div class="right-manage">
                <el-row type="flex" align="middle">
                    <el-col :span="3" style="text-align:right">登录名：</el-col>
                    <el-col>1343455556656</el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="3" style="text-align:right">角色信息：</el-col>
                    <el-col>
                        <div class="right-manage-form">
                            <i v-for="(i ,index) in [,,,,,,,,,,,,,,,]" :key="index">
                                <el-checkbox>二级分润管理</el-checkbox>
                            </i>
                        </div>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain @click="closeDialog()">确认修改</el-button>
                </el-row>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>-->
        </el-dialog>
        <!-- 权限修改 -->
    </div>
</template>

<style lang="scss" src="./agent-operator-manage.scss" scoped>
</style>
<script src="./agent-operator-manage.js"></script>
