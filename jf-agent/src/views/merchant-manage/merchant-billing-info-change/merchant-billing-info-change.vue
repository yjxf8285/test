<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="merchantNumber" v-model="merchantBillingInfoChange.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button type="primary" size="mini">商户查询</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称：</el-col>
        <el-col :span="6" class="el-col-common" />
      </el-row>
    </div>
    <div class="footer" />
  </div>
</template>
<style lang="scss" src="./merchant-billing-info-change.scss" scoped></style>
<script src="./merchant-billing-info-change.js"></script>
