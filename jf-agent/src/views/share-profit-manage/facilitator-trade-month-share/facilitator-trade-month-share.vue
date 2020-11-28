<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">资金主体</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorTradeMonthShare.fundingBody"
            size="mini"
          >
            <el-option
              v-for="(item,index) in fundingBodyOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">分润日期查询区间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorTradeMonthShare.shareDateQuery"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="btns">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./facilitator-trade-month-share.js"></script>
<style lang="scss" src="./facilitator-trade-month-share.scss" scoped></style>
