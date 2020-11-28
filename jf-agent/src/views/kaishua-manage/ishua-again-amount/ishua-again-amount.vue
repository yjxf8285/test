<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:56:10
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-again-amount/ishua-again-amount.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <table>
                        <tr>
                            <td class="left">商户编号：</td>
                            <td>
                                <el-input v-model="defaultFee" style="width:300px;" size="mini" />
                            </td>
                        </tr>
                    </table>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>提交</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./ishua-again-amount.js"></script>
<style lang="scss" src="./ishua-again-amount.scss" scoped></style>
