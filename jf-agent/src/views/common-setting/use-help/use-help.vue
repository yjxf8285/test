<!--
 * @Author: wuyulong
 * @Date: 2019-12-25 16:10:55
 * @LastEditTime: 2020-05-07 18:00:01
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/views/common-setting/use-help/use-help.vue
 -->
<template>
    <div class="feed-back">
        <div class="jf-main-content">
            <div class="use-help">
                <el-form :model="formData" :inline="true" :rules="rules" label-width="130" label-position="right" ref="form">
                    
                    <el-row type="flex" align="middle" justify="center">
                        <!-- <span> </span> -->
                        <el-form-item label="关键字：" prop="keyWord">
                            <el-input 
                                style="width:400px" 
                                placeholder="请输入关键字" 
                                size="small" maxlength="50" v-model.trim="formData.keyWord" 
                            />
                        </el-form-item>
                        
                    </el-row>

                    <el-row type="flex" justify="center" style="margin:30px 0 20px;">
                        <el-button size="medium" type="primary" @click="submitForm('form')">查询</el-button>
                        <el-button size="medium" style="margin-left:20px;" @click="resetForm('form')">重置</el-button>
                    </el-row>
                
                </el-form>

            </div>
            
            <div style="margin-top:70px; margin-bottom:15px; font-size:14px; font-weight:500">
                <i class="el-icon-question"></i>
                自助排查问题列表
            </div>

            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="Q: pos机正常使用步骤" name="1">
                    A: 支持的信用卡还款银行在还款界面的银行列表中可查询，工、农、中、建、交通、招商银行均会陆续开通，敬请关注。
                </el-collapse-item>
                <el-collapse-item title="Q: 服务商无法分润的原因分析" name="2">
                    A: 支持的信用卡还款银行在还款界面的银行列表中可查询，工、农、中、建、交通、招商银行均会陆续开通，敬请关注。
                </el-collapse-item>
                <el-collapse-item title="Q: I版（i刷）信用卡还款支持银行哪些银行的还款" name="3">
                    A: 支持的信用卡还款银行在还款界面的银行列表中可查询，工、农、中、建、交通、招商银行均会陆续开通，敬请关注。
                </el-collapse-item>
            </el-collapse>

            <div style="text-align:right; margin-top:15px;">
                <el-pagination 
                    background
                    layout="prev, pager, next, jumper"
                    :total="1000">
                </el-pagination>
            </div>

        </div>
    </div>
</template>

<style lang="scss" src="./use-help.scss" scoped>
</style>
<script src="./use-help.js"></script>
