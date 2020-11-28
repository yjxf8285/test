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
            v-model="merchantAptitudeChangeOrderQuery.merchantNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select v-model="merchantAptitudeChangeOrderQuery.documentState" size="mini">
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
        <el-col :span="4" class="el-col-common el-col-title">发起时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="merchantAptitudeChangeOrderQuery.startDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">结束时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="merchantAptitudeChangeOrderQuery.endDate"
            type="date"
            placeholder="选择日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./merchant-aptitude-change-order-query.js"></script>
<style lang="scss" src="./merchant-aptitude-change-order-query.scss" scoped></style>
