<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="transactionNumber" class="pointer">交易流水号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="transactionNumber" v-model="orderPayQuery.transactionNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantOrderNumber" class="pointer">商户订单号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="merchantOrderNumber"
            v-model="orderPayQuery.merchantOrderNumber"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">订单状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="orderPayQuery.orderState" size="mini">
            <el-option
              v-for="(item,index) in orderStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="orderPayQuery.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="orderMoney" class="pointer">订单金额</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="orderMoney" v-model="orderPayQuery.orderMoney1" size="mini" />-
          <el-input v-model="orderPayQuery.orderMoney2" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">下单时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="orderPayQuery.placeOrderTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            size="mini"
            end-placeholder="结束日期"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">支付时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="orderPayQuery.paymentTime"
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
<script src="./order-pay-query.js"></script>
<style lang="scss" src="./order-pay-query.scss" scoped></style>
