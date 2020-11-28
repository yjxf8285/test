<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户编号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button size="mini" type="primary">查询</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">所属网点</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">已审核POS 台</el-col>
        <el-col :span="10" class="el-col-common">已绑定POS 台</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">POS序列号</el-col>
        <el-col :span="10" class="el-col-common">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">绑定机具类型</el-col>
        <el-col :span="10" class="el-col-common">
          <el-radio label="1">备选项</el-radio>
          <el-radio label="2">备选项</el-radio>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">提示信息</el-col>
        <el-col :span="20" class="el-col-common red">注如绑定多台POS，请在序列号之间用逗号分隔。如81011357,23490981</el-col>
      </el-row>
      <div class="btns">
        <el-button size="medium" type="primary">绑定</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./pos-bind-apply.js"></script>
<style lang="scss" src="./pos-bind-apply.scss" scoped></style>
