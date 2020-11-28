<template>
  <div id="root">
    <div class="content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">变更后活动类型</el-col>
        <el-col :span="8" class="el-col-common">2019年Q4趣付传统pos携机活动</el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">入库模板</el-col>
        <el-col :span="6" class="el-col-common">
          <a href>机具活动变更模板</a>
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
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common" />
        <el-col :span="16" class="el-col-common red">提示终端所参加活动变更为携机活动后将无法修改，请谨慎操作！</el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" size="medium">提交</el-button>
      <el-button type="primary" size="medium">导出失败明细</el-button>
    </div>
  </div>
</template>
<script src="./activate-change.js"></script>
<style lang="scss" src="./activate-change.scss" scoped></style>
