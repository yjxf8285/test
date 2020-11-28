<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="productionNumber" class="pointer">产品编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="productionNumber"
            v-model="merchantProductionQuery.productionNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="productionName" class="pointer">产品名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="productionName"
            v-model="merchantProductionQuery.productionName"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="merchantNumber"
            v-model="merchantProductionQuery.merchantNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" v-model="merchantProductionQuery.merchantName" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="businessRequestNumber" class="pointer">业务请求编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="businessRequestNumber"
            v-model="merchantProductionQuery.businessRequestNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="merchantProductionQuery.state" size="mini">
            <el-option
              v-for="(item,index) in stateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">计费来源</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="merchantProductionQuery.billingOrigin"
            size="mini"
          >
            <el-option
              v-for="(item,index) in billingOriginOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">交易时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="merchantProductionQuery.tradeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            size="mini"
            end-placeholder="结束日期"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">完成时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="merchantProductionQuery.completeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            size="mini"
            end-placeholder="结束日期"
          />
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
<script src="./merchant-production-query.js"></script>
<style lang="scss" src="./merchant-production-query.scss" scoped></style>
