<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:55:16
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/system-notice/system-notice.vue
 -->
<template>
    <div class="operator-manage">
        <div class="jf-main-content">
            <div class="operator-manage-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2.5">标题：</el-col>
                    <el-col :span="7">
                        <el-input v-model="loginName" size="mini" />
                    </el-col>
                    <el-col :span="5" />
                    <el-col :span="1.5">创建时间：</el-col>
                    <el-col :span="8">
                        <el-date-picker
                            v-model="startTime"
                            size="mini"
                            placeholder="请选择"
                            style="width:130px;"
                        />—
                        <el-date-picker
                            v-model="endTime"
                            size="mini"
                            placeholder="请选择"
                            style="width:130px;"
                        />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle" justify="center" style="margin-top:40px">
                    <el-button size="medium" type="primary" plain>查询</el-button>
                    <el-button size="medium" style="margin-left:20px">重置</el-button>
                </el-row>

                <div class="operator-manage-query">
                    <el-table :data="agentList" border>
                        <el-table-column label="标题" prop="noticeTitle" width="250" />
                        <el-table-column label="创建时间" prop="createTime" />
                        <el-table-column label="生效时间" prop="doTime" />
                        <el-table-column label="失效时间" prop="lostTime" />
                        <el-table-column label="操作">
                            <a href="javascript:;" @click="detailNotice()">公告详情</a>
                        </el-table-column>
                    </el-table>

                    <div class="operator-manage-pagination">
                        <el-pagination
                            :page-size="10"
                            :total="1000"
                            layout="total,prev,pager,next"
                            style="text-align:center"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 权限修改 -->
        <el-dialog title="业务公告" :visible.sync="visibleDialog">
            <div class="notice-dialog">
                <div class="notice-dialog-title">测试服务商系统公告含有图片</div>
                <div class="notice-dialog-content">
                    <h1>三、返现政策</h1>
                    <p>1.终端激活后服务商获得交易奖励10 元/户。</p>
                    <p>2.商户激活日后的31-60 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>3.商户激活日后的61-90 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>注：只有在完成上一阶段达标的商户才能继续参与下一阶段的达标活动。</p>
                </div>
                <div class="notice-dialog-title">测试服务商系统公告含有图片</div>
                <div class="notice-dialog-content">
                    <h1>三、返现政策</h1>
                    <p>1.终端激活后服务商获得交易奖励10 元/户。</p>
                    <p>2.商户激活日后的31-60 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>3.商户激活日后的61-90 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>注：只有在完成上一阶段达标的商户才能继续参与下一阶段的达标活动。</p>
                </div>
                <div class="notice-dialog-title">测试服务商系统公告含有图片</div>
                <div class="notice-dialog-content">
                    <h1>三、返现政策</h1>
                    <p>1.终端激活后服务商获得交易奖励10 元/户。</p>
                    <p>2.商户激活日后的31-60 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>3.商户激活日后的61-90 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>注：只有在完成上一阶段达标的商户才能继续参与下一阶段的达标活动。</p>
                </div>
                <div class="notice-dialog-title">测试服务商系统公告含有图片</div>
                <div class="notice-dialog-content">
                    <h1>三、返现政策</h1>
                    <p>1.终端激活后服务商获得交易奖励10 元/户。</p>
                    <p>2.商户激活日后的31-60 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>3.商户激活日后的61-90 天内消费满 5000 元，服务商获得交易奖励20 元/户。</p>
                    <p>注：只有在完成上一阶段达标的商户才能继续参与下一阶段的达标活动。</p>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>-->
        </el-dialog>
        <!-- 权限修改 -->
    </div>
</template>

<style lang="scss" src="./system-notice.scss" scoped>
</style>
<script src="./system-notice.js"></script>
