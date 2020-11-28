<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="deleteMerchantQuery.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">操作时间</el-col>
        <el-col :span="8" class="el-col-common">
          <el-date-picker
            v-model="deleteMerchantQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./delete-merchant-query.js"></script>
<style lang="scss" src="./delete-merchant-query.scss" scoped></style>
