<template>
  <div id="root">
    <!-- <div class="header">
      <div class="annotation-red">
        (
        <span>*</span>导出数据为登录代理商下所选交易时间内所有分润交易明细)
      </div>
    </div>-->
    <div class="jf-main-content">
      <div class="annotation-red">
        (
        <span>*</span>导出数据为登录代理商下所选交易时间内所有分润交易明细)
      </div>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="branchTelephoneNumber" class="pointer">分支机构手机号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="branchTelephoneNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="facilitatorName" class="pointer">交易时间</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="branchShareProfit.tradeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
        <el-button type="primary" size="medium">查看合计</el-button>
        <el-button type="primary" size="medium">导出申请</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./branch-share-profit-new.js"></script>
<style lang="scss" src="./branch-share-profit-new.scss" scoped></style>
