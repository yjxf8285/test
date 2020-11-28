<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:45:28
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/account-cost-setup/account-cost-setup.vue
 -->
<template>
    <div class="perfer-merchant-import">
        <div class="jf-main-content">
            <div class="perfer-merchant-import-content">
                <el-row type="flex" align="middle">
                    <el-col :span="3">下级登录手机号:</el-col>
                    <el-col :span="7" style="margin-right:20px;">
                        <el-input size="mini" />
                    </el-col>
                    <el-col :span="14">
                        <i class="red">下级分润成本必须大于等于本级分润成本，分润比例不能大于1</i>。实际分润=您预计分润-下级预计分润
                    </el-col>
                </el-row>

                <div class="account-cost-setup">
                    <div class="perfer-merchant-import-header">
                        <span />
                        I刷分润设置
                    </div>
                    <div class="kaishua_form">
                        <el-table :data="kaishua" border>
                            <el-table-column label="产品名称" prop="title" />
                            <el-table-column label="本级分润成本" prop="type" />
                            <el-table-column label="下级分润成本" prop="lowerCost" />
                            <el-table-column label="本级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="下级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="本级封顶成本" />
                            <el-table-column label="下级封顶成本" />
                            <el-table-column label="生效时间" prop="lostTime" />
                            <el-table-column label="失效时间" prop="lostTime" />
                            <el-table-column label="分润说明(假设交易额10000,商户成本100)" prop="lostTime" />
                        </el-table>
                    </div>

                    <div class="perfer-merchant-import-header">
                        <span />
                        POS类型分润设置
                    </div>

                    <div class="kaishua_form">
                        <el-table :data="kaishua" border>
                            <el-table-column label="产品名称" prop="title" />
                            <el-table-column label="本级分润成本" prop="type" />
                            <el-table-column label="下级分润成本" prop="lowerCost" />
                            <el-table-column label="本级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="下级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="本级封顶成本" />
                            <el-table-column label="下级封顶成本" />
                            <el-table-column label="生效时间" prop="lostTime" />
                            <el-table-column label="失效时间" prop="lostTime" />
                            <el-table-column label="分润说明(假设交易额10000,商户成本100)" prop="lostTime" />
                        </el-table>
                    </div>

                    <div class="perfer-merchant-import-header">
                        <span />
                        活动分润设置
                    </div>

                    <div class="kaishua_form">
                        <el-table :data="kaishua" border>
                            <el-table-column label="产品名称" prop="title" />
                            <el-table-column label="本级分润成本" prop="type" />
                            <el-table-column label="下级分润成本" prop="lowerCost" />
                            <el-table-column label="本级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="下级分润比例">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="本级封顶成本" />
                            <el-table-column label="下级封顶成本" />
                            <el-table-column label="生效时间" prop="lostTime" />
                            <el-table-column label="失效时间" prop="lostTime" />
                            <el-table-column label="分润说明(假设交易额10000,商户成本100)" prop="lostTime" />
                        </el-table>
                    </div>

                    <div class="perfer-merchant-import-header">
                        <span />
                        其他分润设置
                    </div>

                    <div class="kaishua_form">
                        <el-table :data="yunshanfu" border>
                            <el-table-column label="产品名称" prop="title" />
                            <el-table-column label="结算方式" prop="type" />
                            <el-table-column label="下级交易成本" prop="lowerCost">
                                <template slot-scope="scope">
                                    <el-input :placeholder="scope.row.lowerCost" size="mini" />
                                </template>
                            </el-table-column>
                            <el-table-column label="秒到成本" width="250">--</el-table-column>
                            <el-table-column label="生效时间" prop="time" />
                            <el-table-column label="失效时间" prop="lostTime" />
                        </el-table>
                    </div>

                    <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
                        <el-button type="primary" size="medium">新增</el-button>
                        <el-button size="medium" style="margin-left:20px;">重置</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./account-cost-setup.scss" scoped>
</style>
<script src="./account-cost-setup.js"></script>
