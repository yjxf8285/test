<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:49:01
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/add-account/add-account.vue
 -->
<template>
    <div class="perfer-merchant-import">
        <div class="jf-main-content">
            <div class="perfer-merchant-import-content">
                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">账户类型：</el-col>
                    <el-col :span="22">
                        <el-select v-model="userRole" size="mini">
                            <el-option value="分支机构" />
                            <el-option value="服务商管理员" />
                            <el-option value="销售员" />
                        </el-select>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">简称：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                    <el-col :span="2" />
                    <el-col :span="2" type="flex" style="text-align:right">全称：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">联系人：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                    <el-col :span="2" />
                    <el-col :span="2" type="flex" style="text-align:right">联系电话：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">收货人：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                    <el-col :span="2" />
                    <el-col :span="2" type="flex" style="text-align:right">收货电话：</el-col>
                    <el-col :span="9">
                        <el-input v-model="licenseNo" size="mini" />
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">收货地址：</el-col>
                    <el-col :span="22" class="receiveAddress">
                        <el-row type="flex" align="center">
                            <el-col :span="3" style="line-height:30px;">所属地区：</el-col>
                            <el-col>
                                <el-cascader
                                    v-model="selectedOptions"
                                    size="mini"
                                    :options="options"
                                    style="width:300px"
                                    @change="handleChange"
                                />
                                <i class="red" style="margin-left:10px;">无所属县(乡)可不选</i>
                            </el-col>
                        </el-row>
                        <el-row type="flex" align="center">
                            <el-col :span="3" style="line-height:30px;">详细地址：</el-col>
                            <el-col>
                                <el-input type="textarea" />
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">登录名：</el-col>
                    <el-col :span="10">
                        <el-input v-model="licenseNo" size="mini" style="width:200px;" />
                        <i style="color:#999">(请输入手机号)</i>
                    </el-col>
                    <el-col :span="2" type="flex" style="text-align:right">真实姓名：</el-col>
                    <el-col :span="10">
                        <el-input v-model="licenseNo" size="mini" style="width:200px;" />
                        <i style="color:#999">(请输入中文)</i>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">验证码：</el-col>
                    <el-col :span="20">
                        <el-input v-model="licenseNo" size="mini" style="width:200px;" />
                        <el-button size="mini" style="margin:0 10px;">获取验证码</el-button>
                        <i class="red">请填写真实手机号，用于接收平台登录密码</i>
                    </el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="2" type="flex" style="text-align:right">角色信息：</el-col>
                    <el-col :span="22" class="receiveAddress">
                        <el-row type="flex" align="middle">
                            <el-col :span="4">
                                <el-checkbox style="font-size:16px; color:#333;">全部选择</el-checkbox>
                            </el-col>
                            <el-col :span="6">
                                <el-checkbox style="font-size:16px;color:#333;">全部反选</el-checkbox>
                            </el-col>
                            <el-col style="color:#409dff;cursor:pointer">
                                <i class="el-icon-info" />
                                角色使用帮助
                            </el-col>
                        </el-row>
                        <el-row
                            type="flex"
                            align="middle"
                            style="font-weight:normal;font-size:12px;margin-top:30px"
                        >
                            <div class="roles-content">
                                <div class="checkBox">
                                    <el-checkbox>资质补充</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>机具分配(新)</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>工单处理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>提报商户</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>报表查询</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>终端查询解绑</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>终端绑定</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>商户查询</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>账户管理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>轻松富</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>商户变更查询</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>商户变更</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>下级账户角色</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>商户VIP申请</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>交易导出</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>交易查询</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>风险管理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>我的信息管理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>资料管理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>退单流程</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>财务管理</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>活动机具激活状态查询</el-checkbox>
                                </div>
                                <div class="checkBox">
                                    <el-checkbox>新增爱刷用户</el-checkbox>
                                </div>
                            </div>
                        </el-row>
                    </el-col>
                </el-row>

                <div class="perfer-merchant-import-header">
                    <span />
                    开刷分润设置
                </div>

                <div class="kaishua_form">
                    <el-table :data="kaishua" border>
                        <el-table-column label="产品名称" prop="title" />
                        <el-table-column label="结算方式" prop="type" />
                        <el-table-column label="下级交易成本" prop="lowerCost">
                            <template slot-scope="scope">
                                <el-input :placeholder="scope.row.lowerCost" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="秒到成本" width="250">
                            <template slot-scope="scope">
                                <p>
                                    商户D0手续费-1元：
                                    <el-input :placeholder="scope.row.D0_1" size="mini" />
                                </p>
                                <p>
                                    商户D0手续费-2元：
                                    <el-input :placeholder="scope.row.D0_2" size="mini" />
                                </p>
                                <p>
                                    商户D0手续费-3元：
                                    <el-input :placeholder="scope.row.D0_3" size="mini" />
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="生效时间" prop="time" />
                        <el-table-column label="失效时间" prop="lostTime" />
                    </el-table>
                </div>

                <div class="perfer-merchant-import-header">
                    <span />
                    POS类型分润设置
                </div>

                <div class="kaishua_form">
                    <el-table :data="kaishua" border>
                        <el-table-column label="产品名称" prop="title" />
                        <el-table-column label="结算方式" prop="type" />
                        <el-table-column label="下级交易成本" prop="lowerCost">
                            <template slot-scope="scope">
                                <el-input :placeholder="scope.row.lowerCost" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="秒到成本" width="250">
                            <template slot-scope="scope">
                                <p>
                                    商户D0手续费-1元：
                                    <el-input :placeholder="scope.row.D0_1" size="mini" />
                                </p>
                                <p>
                                    商户D0手续费-2元：
                                    <el-input :placeholder="scope.row.D0_2" size="mini" />
                                </p>
                                <p>
                                    商户D0手续费-3元：
                                    <el-input :placeholder="scope.row.D0_3" size="mini" />
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="生效时间" prop="time" />
                        <el-table-column label="失效时间" prop="lostTime" />
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
                    <el-button type="primary" size="medium">提交</el-button>
                    <el-button size="medium" style="margin-left:20px;">重置</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<style lang="scss" src="./add-account.scss" scoped>
</style>
<script src="./add-account.js"></script>
