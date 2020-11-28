<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">统计时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorShareBusinessQuery.countTime"
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
      </div>
    </div>
  </div>
</template>
<script src="./facilitator-share-business-query.js"></script>
<style lang="scss" src="./facilitator-share-business-query.scss" scoped></style>
