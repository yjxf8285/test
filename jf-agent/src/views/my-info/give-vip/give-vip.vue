<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:12
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/give-vip/give-vip.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form ref="form" :v-model="form" label-width="130px">
                    <el-form-item label="服务商编号：">
                        <el-input v-model="agentNo" size="small" />
                    </el-form-item>
                    <el-form-item label="赠送名额：">
                        <el-input v-model="agentNo" size="small" />
                    </el-form-item>
                    <el-form-item label="选择文件上传：">
                        <el-input v-model="agentNo" type="file" size="small" />
                    </el-form-item>
                    <el-form-item label="选择数据所在列：">
                        服务商编号所在列：
                        <el-select
                            v-model="agentRow"
                            size="mini"
                            style="width:70px;margin-right:20px"
                        >
                            <el-option value="1" />
                            <el-option value="2" />
                            <el-option value="3" />
                            <el-option value="4" />
                            <el-option value="5" />
                        </el-select>名额数量所在列：
                        <el-select v-model="agentCol" size="mini" style="width:70px">
                            <el-option value="1" />
                            <el-option value="2" />
                            <el-option value="3" />
                            <el-option value="4" />
                            <el-option value="5" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary">批量名额赠送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script src="./give-vip.js"></script>
<style lang="scss" src="./give-vip.scss" scoped></style>
