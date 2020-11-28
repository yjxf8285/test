<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户编号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button round size="mini">查询商户</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称</el-col>
        <el-col :span="6" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">增加POS</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">资质一</el-col>
        <el-col :span="6" class="el-col-common">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="mini" type="success">上传到服务器</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">资质二</el-col>
        <el-col :span="6" class="el-col-common">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="mini" type="success">上传到服务器</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common">说明</el-col>
        <el-col :span="10" class="el-col-common grey">请使用jpeg或jpg格式文件上传，单个上传文件不能大于300K</el-col>
      </el-row>
      <div class="btns">
        <el-button size="medium" type="primary">提交</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./pos-adjust-apply.js"></script>
<style lang="scss" src="./pos-adjust-apply.scss" scoped></style>
