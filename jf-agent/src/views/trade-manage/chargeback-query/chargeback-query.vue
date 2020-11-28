<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="chargebackQuery.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantForShort" class="pointer">商户简称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantForShort" v-model="chargebackQuery.merchantForShort" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="tradeCardNumber" class="pointer">交易卡号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="tradeCardNumber" v-model="chargebackQuery.tradeCardNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">发起日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="chargebackQuery.startDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            size="mini"
            end-placeholder="结束日期"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="originalTradeMoney" class="pointer">原交易金额</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="originalTradeMoney"
            v-model="chargebackQuery.originalTradeMoney1"
            size="mini"
          />-
          <el-input v-model="chargebackQuery.originalTradeMoney2" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">交易时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="chargebackQuery.tradeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            size="mini"
            end-placeholder="结束日期"
          />
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">处理结果</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="chargebackQuery.resultOptions" size="mini">
            <el-option
              v-for="(item,index) in resultOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >{{ item.label }}</el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- <check-total /> -->
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
        <el-button size="medium" type="primary" @click="open">查看合计</el-button>
        <el-button size="medium" type="primary">导出结果</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./chargeback-query.js"></script>
<style lang="scss" src="./chargeback-query.scss" scoped></style>
