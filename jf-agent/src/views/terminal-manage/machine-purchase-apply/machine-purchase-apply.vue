<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">历史明细</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col
          :span="24"
          class="el-col-common el-col-title"
        >尊敬的用户：您已累计购买移动机具4390台，固定机具1台，网线机具0台，i刷机具11367台，台式移动机具0台，I刷蓝牙刷卡头申请机具0台，智能POS机具0台，开票扫码水牌机具0台。</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">机具采购活动</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">选择活动：</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select value="123" size="mini">
            <el-option value="123" label="123" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">POS采购</el-col>
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
    <div class="btns">
      <el-button size="medium" type="primary">去结算</el-button>
    </div>
  </div>
</template>
<script src="./machine-purchase-apply.js"></script>
<style lang="scss" src="./machine-purchase-apply.scss" scoped></style>
