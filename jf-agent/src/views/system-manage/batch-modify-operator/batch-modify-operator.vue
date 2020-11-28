<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:52:38
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/batch-modify-operator/batch-modify-operator.vue
 -->
<template>
    <div class="perfer-merchant-import">
        <div class="jf-main-content">
            <div class="perfer-merchant-import-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2">上传文件</el-col>
                    <el-col :span="12">
                        <el-upload
                            class="perfer-merchant-import-upload"
                            drag
                            action="https://jsonplaceholder.typicode.com/posts/"
                            multiple
                        >
                            <i class="el-icon-upload" />
                            <div class="el-upload__text">
                                将文件拖到此处，或
                                <em>点击上传</em>
                            </div>
                        </el-upload>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="mini" plain>
                            <i class="el-icon-download" /> 删除模板下载
                        </el-button>
                    </el-col>
                </el-row>

                <el-row
                    type="flex"
                    align="middle"
                    justify="center"
                    style="margin-bottom:70px; margin-top:70px;"
                >
                    <el-button type="primary" size="medium">批量修改</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./batch-modify-operator.scss" scoped>
</style>
<script src="./batch-modify-operator.js"></script>
