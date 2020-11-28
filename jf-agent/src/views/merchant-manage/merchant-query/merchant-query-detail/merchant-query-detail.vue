<template>
  <div id="root">
    <div class="jf-main-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商户信息" name="first">
          <div class="table">
            <template v-for="item in merchantInformation">
              <div>{{item.label}}：</div>
              <div>{{item.value}}</div>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="费率信息" name="second">
          <div class="table">
            <template v-for="item in rateInformation">
              <div>{{item.label}}：</div>
              <div>{{item.value}}</div>
            </template>
          </div>
          <p class="annotation">
            <i class="el-icon-question"></i>注：银联二维码1000元以上交易费率同银行卡费率
          </p>
        </el-tab-pane>
        <el-tab-pane label="结算信息" name="third">
          <p class="billInfo-title">结算方式</p>
          <div class="table-two-col">
            <div>结算方式：</div>
            <div>{{billInformation.billWay}}</div>
          </div>
          <p class="billInfo-title">结算账号</p>
          <div class="table" v-for="(item,index) in billInformation.billAccount" :key="index">
            <template v-if="item.accountType==1">
              <div>账户类型：</div>
              <div>{{item.message.accountType}}</div>
              <div>开户行：</div>
              <div>{{item.message.openBank}}</div>
              <div>开户支行：</div>
              <div>{{item.message.openBranchBank}}</div>
              <div>开户名：</div>
              <div>{{item.message.openName}}</div>
              <div>开户账号：</div>
              <div>{{item.message.openAccount}}</div>
            </template>
            <template v-else-if="item.accountType==2">
              <div>账户类型：</div>
              <div>{{item.message.accountType}}</div>
              <div>开户行：</div>
              <div>{{item.message.openBank}}</div>
              <div>开户支行：</div>
              <div>{{item.message.openBranchBank}}</div>
              <div>开户名：</div>
              <div>{{item.message.openName}}</div>
              <div>开户账号：</div>
              <div>{{item.message.openAccount}}</div>
            </template>
            <template v-else></template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="POS信息" name="fourth"></el-tab-pane>
        <el-tab-pane label="资质信息" name="fifth">
          <div class="table">
            <template v-for="item in aptitudeInformation">
              <div>{{item.label}}：</div>
              <div>{{item.value}}</div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>
<style src="./merchant-query-detail.scss" lang="scss" scoped></style>
<script src="./merchant-query-detail.js"></script>