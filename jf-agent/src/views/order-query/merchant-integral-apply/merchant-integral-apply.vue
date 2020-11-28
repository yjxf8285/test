<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="merchantIntegralApply.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" v-model="merchantIntegralApply.merchantName" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="area" class="pointer">所属区域</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="area" v-model="merchantIntegralApply.area" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="merchantIntegralApply.documentState"
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
        <el-col :span="4" class="el-col-common el-col-title">审核结果</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="merchantIntegralApply.auditResult" size="mini">
            <el-option
              v-for="(item,index) in auditResultOptions"
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
<script src="./merchant-integral-apply.js"></script>
<style lang="scss" src="./merchant-integral-apply.scss" scoped></style>
