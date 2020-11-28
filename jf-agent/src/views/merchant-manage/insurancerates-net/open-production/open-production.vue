<template>
  <div id="root">
    <div class="header">
      <div class>产品信息</div>
    </div>
    <div class="content">
      <el-row class="el-row-common">
        <el-col :span="6" class="el-col-common">
          <el-checkbox v-model="openProduction.prepaidInsurance" @change="writable">
            <span>预付卡保险</span>
          </el-checkbox>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <label for="insuranceRate" class="pointer">保费比例：</label>
          <el-input
            id="insuranceRate"
            v-model="openProduction.insuranceRate"
            size="mini"
            :disabled="disabled"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer" />
  </div>
</template>
<script src="./open-production.js"></script>
<style lang="scss" src="./open-production.scss" scoped></style>
