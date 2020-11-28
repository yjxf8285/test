<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:54:44
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/menu-manage/menu-manage.vue
 -->
<template>
    <div class="roles-manage">
        <div class="jf-main-content">
            <div class="menu-manage-content">
                <el-tabs v-model="activeName" type="crad" @tab-click="tabClick">
                    <el-tab-pane label="展开所有" name="0" />
                    <el-tab-pane label="关闭所有" name="1" />
                </el-tabs>

                <el-tree
                    ref="selectTree"
                    :data="menuList"
                    highlight-current
                    show-checkbox
                    default-expand-all
                    :node-key="menuList.id"
                />

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>提交</el-button>
                    <el-button size="medium" style="margin-left:20px">取消</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./menu-manage.scss" scope>
</style>
<script src="./menu-manage.js"></script>
