<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="rateChangeQuery.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantName" v-model="rateChangeQuery.merchantName" size="mini" />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="变更类型"></el-table-column>
        <el-table-column label="商户编号"></el-table-column>
        <el-table-column label="商户名称"></el-table-column>
        <el-table-column label="原借记卡"></el-table-column>
        <el-table-column label="新借记卡"></el-table-column>
        <el-table-column label="原DO附加费"></el-table-column>
        <el-table-column label="新DO附加费"></el-table-column>
        <el-table-column label="原贷记卡"></el-table-column>
        <el-table-column label="新贷记卡"></el-table-column>
        <el-table-column label="原扫码"></el-table-column>
        <el-table-column label="新扫码"></el-table-column>
        <el-table-column label="原双免"></el-table-column>
        <el-table-column label="新双免"></el-table-column>
        <el-table-column label="发起时间"></el-table-column>
        <el-table-column label="生效时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./rate-change-query.js"></script>
<style lang="scss" src="./rate-change-query.scss" scoped></style>
