<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:58:40
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/kaishua-pos-distribute/kaishua-pos-distribute.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <div class="form">
                    <h1 style="margin-top:0">分支机构修改费率查询</h1>
                    <table>
                        <tr>
                            <td class="left">分配机具信息：</td>
                            <td>
                                <el-upload action="##">
                                    <el-button type="primary" size="mini">上传文件</el-button>
                                </el-upload>
                            </td>
                            <td class="left">标准模板下载：</td>
                            <td>
                                <el-button type="primary" size="mini" plain>标准模板下载</el-button>
                            </td>
                        </tr>
                        <tr>
                            <td class="left red">提示：</td>
                            <td colspan="3" class="red">交易状态及其已经分配的POS不允许分配</td>
                        </tr>
                    </table>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" plain>提交</el-button>
                    </el-row>
                </div>

                <div class="form">
                    <h1>机具出库结果</h1>
                    <table>
                        <tr>
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

<script src="./kaishua-pos-distribute.js"></script>
<style lang="scss" src="./kaishua-pos-distribute.scss" scoped></style>
