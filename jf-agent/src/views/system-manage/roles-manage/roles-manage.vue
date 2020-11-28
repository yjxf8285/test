<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:53:44
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/roles-manage/roles-manage.vue
 -->
<template>
    <div class="roles-manage">
        <div class="jf-main-content">
            <div class="roles-manage-content">
                <div class="roles-manage-left">
                    <el-row class="roles-manage-left-header">
                        角色名称 :
                        <el-input size="mini" />
                        <el-button size="mini">查询</el-button>
                    </el-row>

                    <div class="roles-manage-left-table">
                        <el-table :data="rolesList">
                            <el-table-column label="角色名称" prop="roleName" />
                            <el-table-column label="状态" prop="roleState" />
                            <el-table-column label="操作">
                                <a href="javascript:;">详情</a>
                            </el-table-column>
                        </el-table>

                        <el-pagination
                            small
                            :page-size="10"
                            layout="total, prev, pager, next"
                            :total="60"
                        />
                    </div>

                    <div class="roles-manage-left-addRole">
                        <el-button
                            size="mini"
                            style="margin:0 auto;"
                            type="primary"
                            @click="addRoles()"
                        >添加角色</el-button>
                    </div>
                </div>
                <div class="roles-manage-right">
                    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
                        <el-tab-pane label="角色功能" name="0" />
                        <el-tab-pane label="角色菜单" name="1" />
                        <el-tab-pane label="修改角色" name="2" />
                    </el-tabs>

                    <div v-if="activeName==0" class="roles-manage-right-item">
                        <el-row class="roles-manage-right-menu" style="margin-bottom:30px;">
                            <el-checkbox>全部选择</el-checkbox>
                            <el-checkbox>全部反选</el-checkbox>
                        </el-row>

                        <el-row class="roles-manage-right-menu">已关联的功能列表：</el-row>
                        <div class="roles-manage-right-form">
                            <i v-for="(i,index) in [,,,,,,,,,,]" :key="index">
                                <el-checkbox>C350-电子卡商户申请查询</el-checkbox>
                            </i>
                        </div>
                        <el-row class="roles-manage-right-menu">未关联的功能列表：</el-row>
                        <div class="roles-manage-right-form">
                            <i v-for="(i,index) in [,,,,,,,,,,]" :key="index">
                                <el-checkbox>C350-电子卡商户申请查询</el-checkbox>
                            </i>
                        </div>
                    </div>
                    <div v-else-if="activeName==1" class="roles-manage-right-item">
                        <el-tree :data="menuList" show-checkbox default-expand-all />

                        <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                            <el-button size="mini" type="primary" plain>提交</el-button>
                            <el-button size="mini" style="margin-left:20px">取消</el-button>
                        </el-row>
                    </div>
                    <div v-else-if="activeName==2" class="roles-manage-right-item">
                        <el-row
                            type="flex"
                            align="middle"
                            justify="center"
                            style="margin-top:30px;"
                        >
                            角色名称：
                            <el-input v-model="modify_roleName" size="mini" style="width:350px;" />
                        </el-row>

                        <el-row type="flex" align="middle" justify="center">
                            角色状态：
                            <el-select v-model="modify_roleState" size="mini" style="width:350px;">
                                <el-option value="可用" />
                                <el-option value="禁用" />
                            </el-select>
                        </el-row>

                        <el-row type="flex" align="middle" justify="center">
                            角色备注：
                            <el-input
                                v-model="modify_roleTips"
                                size="mini"
                                type="textarea"
                                style="width:350px;"
                            />
                        </el-row>

                        <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                            <el-button size="mini" type="primary" plain>提交</el-button>
                            <el-button size="mini" style="margin-left:20px">取消</el-button>
                        </el-row>
                    </div>
                </div>

                <!-- <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>-->
            </div>
        </div>

        <el-dialog
            title="添加角色"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <div class="addRoles">
                <el-row type="flex" align="middle">
                    <el-col :span="6">名称：</el-col>
                    <el-col>
                        <el-input v-model="roleName" size="mini" />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="6">状态：</el-col>
                    <el-col>
                        <el-select v-model="roleState" size="mini">
                            <el-option value="可用" />
                            <el-option value="禁用" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="6">关联菜单：</el-col>
                    <el-col>
                        <el-button type="primary" size="mini" plain @click="chooseMenu()">选择菜单</el-button>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="6">角色备注：</el-col>
                    <el-col>
                        <el-input v-model="roleTips" size="mini" type="textarea" />
                    </el-col>
                </el-row>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="选择菜单"
            :visible.sync="chooseMenuVisible"
            width="30%"
            :before-close="handleClose2"
        >
            <div class="chooseMenu">
                <el-tree :data="menuList" show-checkbox default-expand-all />
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="chooseMenuVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="chooseMenuVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" src="./roles-manage.scss" scope>
</style>
<script src="./roles-manage.js"></script>
