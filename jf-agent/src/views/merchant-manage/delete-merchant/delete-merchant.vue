<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="merchantNumber" v-model="deleteMerchant.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button type="primary" size="mini">商户查询</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称</el-col>
        <el-col :span="6" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">下级代理名称</el-col>
        <el-col :span="6" class="el-col-common" />
      </el-row>
      <div class="footer">
        <div>
          <el-button type="primary" size="medium">提交</el-button>
          <el-button type="primary" size="medium">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./delete-merchant.js"></script>
<style lang="scss" src="./delete-merchant.scss" scoped></style>
