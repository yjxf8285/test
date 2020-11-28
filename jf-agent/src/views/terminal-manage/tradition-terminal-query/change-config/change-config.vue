<template>
  <div id="root">
    <div class="content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">品牌</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="brand" size="mini">
            <el-option
              v-for="(item,index) in brandOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">活动名称</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="activateName" size="mini">
            <el-option
              v-for="(item,index) in activateNameOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">系统接入费-返现金额</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="returnMoney" size="mini">
            <el-option
              v-for="(item,index) in returnMoneyOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="6" class="el-col-common el-col-title">变更机具活动配置</el-col>
        <el-col :span="10" class="el-col-common">
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
<script src="./change-config.js"></script>
<style lang="scss" src="./change-config.scss" scoped></style>
