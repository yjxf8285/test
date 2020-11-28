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
            v-model="merchantResultInfoQuery.merchantNumber"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">变更类型</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="merchantResultInfoQuery.changeType"
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
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="merchantResultInfoQuery.documentState"
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
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="商户编号"></el-table-column>
        <el-table-column label="商户全称"></el-table-column>
        <el-table-column label="类型"></el-table-column>
        <el-table-column label="卡类型"></el-table-column>
        <el-table-column label="开户行"></el-table-column>
        <el-table-column label="开户名"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./merchant-result-info-query.js"></script>
<style lang="scss" src="./merchant-result-info-query.scss" scoped></style>
