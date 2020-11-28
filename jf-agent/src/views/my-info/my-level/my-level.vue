<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:32:52
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/my-level/my-level.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="my-level-content">
                <div class="my-level-header">
                    您的级别：
                    <b>暂未评级</b> 排名击败
                    <i class="red">0.00%</i>同行
                </div>

                <div class="my-level-tabs">
                    <el-tabs type="border-card">
                        <el-tab-pane label="我的特权服务">
                            <table>
                                <thead>
                                    <th width="100">类别</th>
                                    <th>项目</th>
                                    <th>A级</th>
                                    <th>B级</th>
                                    <th>C级</th>
                                    <th>D级</th>
                                    <th>E级</th>
                                </thead>
                                <tr>
                                    <td rowspan="3" class="dark">业务类</td>
                                    <td>赊销</td>
                                    <td>相当于一个月分润</td>
                                    <td>相当于一个月分润</td>
                                    <td>无</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                                <tr>
                                    <td>先付分润后交发票</td>
                                    <td>赊销</td>
                                    <td>一个月</td>
                                    <td>一个月</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                                <tr>
                                    <td>服务类</td>
                                    <td>客服电话优先接入</td>
                                    <td>2个号码/每个服务商</td>
                                    <td>2个号码/每个服务商</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                                <tr>
                                    <td class="dark">法律援助</td>
                                    <td>电话咨询援助</td>
                                    <td>无</td>
                                    <td>无</td>
                                    <td>无</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                                <tr>
                                    <td rowspan="2" class="dark">物料支持</td>
                                    <td>配发开店宝服务商版工服</td>
                                    <td>20件</td>
                                    <td>10件</td>
                                    <td>5件</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                                <tr>
                                    <td>开店宝内刊</td>
                                    <td>15本/期</td>
                                    <td>10本/期</td>
                                    <td>5本/期</td>
                                    <td>无</td>
                                    <td>无</td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="我的记分分析">
                            <table>
                                <thead>
                                    <th width="100">类别</th>
                                    <th>指标名称</th>
                                    <th>指标权重</th>
                                    <th>2016-10</th>
                                    <th>2016-11</th>
                                    <th>2016-12</th>
                                    <th>2017-01</th>
                                    <th>2017-02</th>
                                    <th>2017-03</th>
                                </thead>
                            </table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./my-level.js"></script>
<style lang="scss" src="./my-level.scss" scoped></style>

