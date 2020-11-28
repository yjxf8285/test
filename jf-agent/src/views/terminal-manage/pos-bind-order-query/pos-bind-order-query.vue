<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户编号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">操作时间</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">操作类型</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select size="mini" value="123">
            <el-option label="123" value="123" />
          </el-select>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
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
<script src="./pos-bind-order-query.js"></script>
<style lang="scss" src="./pos-bind-order-query.scss" scoped></style>
