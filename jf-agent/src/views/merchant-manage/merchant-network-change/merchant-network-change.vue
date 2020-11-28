<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantCode" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-common el-input-width">
            <el-input id="merchantCode" v-model="businessOutletsModify.merchantCode" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button type="primary" size="mini">查询商户</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称</el-col>
        <el-col :span="6" class="el-col-common">
          <div>12345</div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">提交</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./merchant-network-change.js"></script>
<style lang="scss" src="./merchant-network-change.scss" scoped></style>
