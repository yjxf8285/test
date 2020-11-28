<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">出库单号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">运单号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">发货时间</el-col>
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
        <el-col :span="4" class="el-col-common el-col-title">接收时间</el-col>
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
      <div class="btns">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" height="260">
        <el-table-column fixed prop="date" label="日期" width="160" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="province" label="省份" width="120" />
        <el-table-column prop="city" label="市区" width="120" />
        <el-table-column prop="address" label="地址" width="400" />
        <el-table-column prop="zip" label="邮编" width="120" />
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>
<script src="./pos-cargo-order-query.js"></script>
<style lang="scss" src="./pos-cargo-order-query.scss" scoped></style>
