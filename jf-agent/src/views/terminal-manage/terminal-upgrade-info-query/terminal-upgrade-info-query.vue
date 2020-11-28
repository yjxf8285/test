<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="6" class="el-col-common el-col-title">请输入机具序列号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button size="mini" type="primary">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" height="250">
        <el-table-column fixed prop="date" label="日期" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="province" label="省份" width="120" />
        <el-table-column prop="city" label="市区" width="120" />
        <el-table-column prop="address" label="地址" width="300" />
        <el-table-column prop="zip" label="邮编" width="120" />
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>
<script src="./terminal-upgrade-info-query.js"></script>
<style lang="scss" src="./terminal-upgrade-info-query.scss" scoped></style>
