<template>
  <div id="root">
    <div class="content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">活动名称</el-col>
        <el-col :span="10" class="el-col-common">2019年Q4趣付传统pos携机活动机具入库</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">厂商型号</el-col>
        <el-col :span="6" class="el-col-common">
          <a href="#">厂商型号下载</a>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">入库模板</el-col>
        <el-col :span="6" class="el-col-common">
          <a href="javascript:;">模板下载</a>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">上传文件</el-col>
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
    </div>
    <div class="footer">
      <el-button type="primary" size="medium">提交</el-button>
      <el-button type="primary" size="medium">导出失败明细</el-button>
    </div>
  </div>
</template>
<script src="./in-store.js"></script>
<style lang="scss" src="./in-store.scss" scoped></style>
