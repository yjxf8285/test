<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:54:54
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/distributed-pos-query/distributed-pos-query.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <!-- <h1>机具出库结果</h1> -->
                    <table>
                        <tr>
                            <td class="left">序列号：</td>
                            <td>
                                <el-input v-model="defaultFee" style="width:300px;" size="mini" />
                            </td>
                            <td class="left">出库对象账号：</td>
                            <td>
                                <el-input v-model="defaultFee" style="width:300px;" size="mini" />
                            </td>
                        </tr>
                    </table>
                </div>

                <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script src="./distributed-pos-query.js"></script>
<style lang="scss" src="./distributed-pos-query.scss" scoped></style>
