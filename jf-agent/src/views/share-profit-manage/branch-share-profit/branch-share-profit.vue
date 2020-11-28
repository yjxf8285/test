<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="orderNumber" class="pointer">订单编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="orderNumber" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
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
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="branchTelephoneNumber" class="pointer">分支机构手机号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="branchTelephoneNumber" size="mini" />
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
<script src="./branch-share-profit.js"></script>
<style lang="scss" src="./branch-share-profit.scss" scoped></style>
