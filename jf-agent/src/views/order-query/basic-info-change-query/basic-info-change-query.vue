<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="merchantNumber" v-model="basicInfoChangeQuery.merchantNumber" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="basicInfoChangeQuery.documentState"
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
        <el-table-column label="商户名称"></el-table-column>
        <el-table-column label="所属服务商"></el-table-column>
        <el-table-column label="所属销售"></el-table-column>
        <el-table-column label="手机号码"></el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="电子邮箱"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./basic-info-change-query.js"></script>
<style lang="scss" src="./basic-info-change-query.scss" scoped></style>
