<template>
  <div id="root">
    <div class="jf-main-content">
      <div>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">
            <label for="beneficiary" class="pointer">受益人</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="beneficiary" size="mini" />
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">
            <label for="beneficiaryName" class="pointer">受益人名称</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="beneficiaryName" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">返现类型</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="type" size="mini">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">返现月份</el-col>
          <el-col :span="6" class="el-col-common">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </el-col>
        </el-row>
        <div class="footer">
          <el-button type="primary" size="medium">查询</el-button>
          <el-button type="primary" size="medium">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./agent-return-query.js"></script>
<style lang="scss" src="./agent-return-query.scss" scoped></style>
