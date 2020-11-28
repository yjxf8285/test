<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="merchantNumber"
            v-model="merchantRateModifyQuery.merchantNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" v-model="merchantRateModifyQuery.merchantName" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="merchantRateModifyQuery.documentState"
            size="mini"
          >
            <el-option
              v-for="(item,index) in documentStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">整改结果</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="merchantRateModifyQuery.result" size="mini">
            <el-option
              v-for="(item,index) in resultOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">截至日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="merchantRateModifyQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
<script src="./merchant-rate-modify-query.js"></script>
<style lang="scss" src="./merchant-rate-modify-query.scss" scoped></style>
