<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">月份</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorProductionShareQueryM.month"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">产品</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorProductionShareQueryM.production"
            size="mini"
          >
            <el-option
              v-for="(item,index) in productionOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
        <el-button type="primary" size="medium">导出</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./facilitator-production-share-query-month.js"></script>
<style lang="scss" src="./facilitator-production-share-query-month.scss" scoped></style>
