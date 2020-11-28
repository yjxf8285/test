<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:33:42
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/my-info/baseinfo-change-apply/baseinfo-change-apply.vue
 -->
<template>
    <div class="my-info">
        <div class="jf-main-content">
            <div class="give-vip-content">
                <el-form ref="form" :model="form" label-width="130px">
                    <el-form-item label="服务商名称：">
                        <p>{{ form.agentName }}</p>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input v-model="form.linkMan" size="small" />
                    </el-form-item>
                    <el-form-item label="手机号码：">
                        <el-input v-model="form.phone" size="small" />
                        <i class="red">* 手机号码修改后，登录账号也将修改，密码不变</i>
                    </el-form-item>
                    <el-form-item label="风险联系人：">
                        <el-input v-model="form.riskMan" size="small" />
                    </el-form-item>
                    <el-form-item label="风险联系电话：">
                        <el-input v-model="form.riskPhone" size="small" />
                    </el-form-item>
                    <el-form-item label="业务联系人：">
                        <el-input v-model="form.businessMan" size="small" />
                    </el-form-item>
                    <el-form-item label="业务联系电话：">
                        <el-input v-model="form.businessPhone" size="small" />
                    </el-form-item>
                    <el-form-item label="收货地址：">
                        <el-input v-model="form.address" size="small" />
                    </el-form-item>
                    <el-form-item label="电子邮箱：">
                        <el-input v-model="form.mail" size="small" />
                    </el-form-item>
                    <br />
                    <el-form-item>
                        <el-button type="primary" size="medium" plain>提交</el-button>
                        <el-button size="medium" style="margin-left:20px;">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script src="./baseinfo-change-apply.js"></script>
<style lang="scss" src="./baseinfo-change-apply.scss" scoped></style>
