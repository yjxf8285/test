<template>
  <div id="root">
    <div class="header">
      <div class="annotation-red">* 请申请查询近180天的产品分润统计</div>
    </div>
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="facilitatorName" class="pointer">统计时间</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorProductionShareQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">产品名称</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorProductionShareQuery.productionName"
            size="mini"
          >
            <el-option
              v-for="(item,index) in productionNameOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">活动分类</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorProductionShareQuery.classOfActivities"
            size="mini"
          >
            <el-option
              v-for="(item,index) in activitiesOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorProductionShareQuery.state"
            size="mini"
          >
            <el-option
              v-for="(item,index) in stateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">查询合计</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./facilitator-production-share-query.js"></script>
<style lang="scss" src="./facilitator-production-share-query.scss" scoped></style>
