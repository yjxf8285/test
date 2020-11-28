<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">说明</el-col>
        <el-col :span="6" class="el-col-common red">轻松富指标100元/个</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">申请个数</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="10" class="el-col-common red">(一次购买数量不能超过1000个)</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">应付金额(元)</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">付款人名称</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">提交</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./qsf-apply.js"></script>
<style lang="scss" src="./qsf-apply.scss" scoped></style>
