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
            v-model="searchAllChangeMerchant.merchantNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="searchAllChangeMerchant.documentState"
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
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" v-model="searchAllChangeMerchant.merchantName" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">整改结果</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="searchAllChangeMerchant.changeResult"
            size="mini"
          >
            <el-option
              v-for="(item,index) in changeResultOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">实际生效日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="searchAllChangeMerchant.effectiveDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">服务商截止日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="searchAllChangeMerchant.serviceExpirationDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户截止日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="searchAllChangeMerchant.merchantExpirationDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">整改类型</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="searchAllChangeMerchant.changeType"
            size="mini"
          >
            <el-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <!-- ** -->
        <el-col :span="4" class="el-col-common el-col-title">是否自助</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="searchAllChangeMerchant.selfHelp" size="mini">
            <el-option
              v-for="(item,index) in selfHelpOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button size="medium" type="primary">查询</el-button>
      <el-button size="medium" type="primary">重置</el-button>
    </div>
  </div>
</template>
<script src="./search-all-change-merchant.js"></script>
<style lang="scss" src="./search-all-change-merchant.scss" scoped></style>
