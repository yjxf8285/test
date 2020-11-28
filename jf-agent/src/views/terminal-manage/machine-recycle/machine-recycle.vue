<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">回收机具信息</el-col>
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
        <el-col :span="4" class="el-col-common el-col-title">标准模板下载</el-col>
        <el-col :span="10" class="el-col-common red">交易状态的POS不允许回收</el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./machine-recycle.js"></script>
<style lang="scss" src="./machine-recycle.scss" scoped></style>
