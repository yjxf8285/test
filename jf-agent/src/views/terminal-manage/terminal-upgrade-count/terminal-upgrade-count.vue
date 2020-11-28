<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">POS厂商</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" size="mini" value="124">
            <el-option value="124" />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">型号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" size="mini" value="124">
            <el-option value="124" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">通讯方式</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" size="mini" value="124">
            <el-option value="124" />
          </el-select>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">导出</el-button>
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
<script src="./terminal-upgrade-count.js"></script>
<style lang="scss" src="./terminal-upgrade-count.scss" scoped></style>
