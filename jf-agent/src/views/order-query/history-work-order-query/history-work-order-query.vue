<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="processInstanceID" class="pointer">流程ID</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="processInstanceID"
            v-model="historyWorkOrderQuery.processInstanceID"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="historyWorkOrderQuery.merchantNumber" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">回复日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="historyWorkOrderQuery.responseDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button size="medium" type="primary">查询</el-button>
      <el-button size="medium" type="primary">重置</el-button>
    </div>
  </div>
</template>
<script src="./history-work-order-query.js"></script>
<style lang="scss" src="./history-work-order-query.scss" scoped></style>
