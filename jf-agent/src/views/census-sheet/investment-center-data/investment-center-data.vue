<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:45:21
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/census-sheet/investment-center-data/investment-center-data.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-row type="flex" align="middle" justify="center">
                    <el-col style="text-align:center">
                        创建时间：
                        <el-date-picker
                            v-model="type"
                            type="date"
                            size="small"
                            style="width:200px"
                            placeholder="请选择"
                        />
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top:30px;">
                    <el-button type="primary" size="medium" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script src="./investment-center-data.js"></script>
<style lang="scss" src="./investment-center-data.scss" scoped></style>
