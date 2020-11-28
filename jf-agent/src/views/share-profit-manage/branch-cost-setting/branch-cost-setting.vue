<template>
  <div id="root">
    <div class="header">
      <div class="annotation-red">
        (
        <span>*</span>导出数据为登录代理商下所选交易时间内所有分润交易明细)
      </div>
    </div>
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="loginTelephoneNumber" class="pointer">登录手机号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="loginTelephoneNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="branchName" class="pointer">分支机构名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="branchName" size="mini" />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" size="small">查询</el-button>
      <el-button type="primary" size="small">重置</el-button>
      <el-button type="primary" size="small">返回</el-button>
    </div>
  </div>
</template>
<script src="./branch-cost-setting.js"></script>
<style lang="scss" src="./branch-cost-setting.scss" scoped></style>
