<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">上传商户文件：</el-col>
        <el-col class="el-col-common" :span="20">
          <div class="el-input-width">
            <el-upload
              ref="upload"
              class="upload-demo"
              action
              :file-list="merchantTransfer.fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="primary">上传到服务器</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">转向目标：</el-col>
        <el-col class="el-col-common" :span="6">
          <el-select class="el-input-width" v-model="merchantTransfer.toTarget" size="mini">
            <el-option
              v-for="(item,index) in toTargetOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">下载标准模板</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src='./merchant-transfer.js'></script>
<style lang="scss" src='./merchant-transfer.scss' scoped></style>
