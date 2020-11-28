<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="shareProfitQuery" class="pointer">分润小计查询区间</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="shareProfitQuery" size="mini" />-
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">分润日期查询区间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="shareProfitQuery.date"
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
        <el-button type="primary" size="medium">查询合计</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./share-profit-query.js"></script>
<style lang="scss" src="./share-profit-query.scss" scoped></style>
