<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <div class="el-input-width">
            <el-input id="merchantNumber" v-model="merchantVIPApply.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <div class="el-input-width">
            <el-input id="merchantName" v-model="merchantVIPApply.merchantName" size="mini" />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">申请VIP日期(区间)</el-col>
        <el-col class="el-col-common" :span="6">
          <el-date-picker
            v-model="merchantVIPApply.vipDateQuery"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">申请VIP类型</el-col>
        <el-col class="el-col-common" :span="6">
          <el-select class="el-input-width" v-model="merchantVIPApply.typeOfVip" size="mini">
            <el-option
              v-for="(item,index) in typeOfVipOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src='./merchant-vip-apply.js'></script>
<style lang="scss" src='./merchant-vip-apply.scss' scoped></style>
