<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="processInstanceID" class="pointer">流程实例ID</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="processInstanceID"
            v-model="facilitatorShareFormQuery.processInstanceID"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorShareFormQuery.documentState"
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
        <el-col :span="4" class="el-col-common el-col-title">月份</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorShareFormQuery.month"
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
<script src="./facilitator-share-order-query.js"></script>
<style lang="scss" src="./facilitator-share-order-query.scss" scoped></style>
