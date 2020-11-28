<!--
 * @Author: wuyulong
 * @Date: 2019-12-30 10:13:06
 * @LastEditTime : 2020-01-02 16:06:01
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/business-info-change/business-info-change.vue
 -->
<template>
  <div class="business-info-change">
    <div class="jf-main-content">
      <div class="business-info-change-content">
        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey" style="color:#f00;">变更类型：</el-col>
          <el-col :span="20">
            <el-select v-model="changeType" size="mini">
              <el-option value="错误变更" />
              <el-option value="资质变更" />
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">商户编号：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入商户编号"
              style="width:200px; margin-right:10px"
              size="mini"
            />
            <el-button size="mini" type="primary">商户查询</el-button>
          </el-col>
          <el-col :span="4" class="grey">商户名称：</el-col>
          <el-col :span="8" />
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">企业名称：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">企业名称：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入企业名称"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">法人姓名：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">法人姓名：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入法人姓名"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">法人身份证号：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">法人身份证号：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入法人身份证号"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">法人身份证地址：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">法人身份证地址：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入法人身份证地址"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">法人证件有效期-起止：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">法人证件有效期-起止：</el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="startDate"
              placeholder="开始日期"
              size="mini"
              style="width:130px"
            />
            —
            <el-date-picker
              v-model="endDate"
              placeholder="结束日期"
              size="mini"
              style="width:130px"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">注册地址：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">注册地址：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入注册地址"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">注册资本：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">注册资本(万元)：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入注册资本"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">公司类型：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">公司类型：</el-col>
          <el-col :span="8">
            <el-select v-model="changeType" size="mini">
              <el-option value="有限责任公司" />
              <el-option value="个体户" />
            </el-select>
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">成立日期：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">成立日期：</el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="startDate"
              placeholder="成立日期"
              size="mini"
              style="width:130px"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">营业期限：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">营业期限：</el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="startDate"
              placeholder="开始日期"
              size="mini"
              style="width:130px"
            />
            —
            <el-date-picker
              v-model="endDate"
              placeholder="结束日期"
              size="mini"
              style="width:130px"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">组织机构代码：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">组织机构代码：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入组织机构代码"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">税务登记证号：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">税务登记证号：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="请输入税务登记证号"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">经营范围：</el-col>
          <el-col :span="8" />
          <el-col :span="4" class="grey">经营范围：</el-col>
          <el-col :span="8">
            <el-input
              v-model="customerNo"
              placeholder="经营范围"
              type="textarea"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="4" class="grey">备注：</el-col>
          <el-col :span="20">
            <el-input
              v-model="customerNo"
              type="textarea"
              size="mini"
            />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle" justify="center" style="margin-top:50px;">
          <el-button size="medium" type="primary">提 交</el-button>
          <el-button size="medium" type="primary" style="margin-left:30px;">重 置</el-button>
        </el-row>

      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./merchant-info-change.scss" scoped>
</style>
<script src="./merchant-info-change.js"></script>
