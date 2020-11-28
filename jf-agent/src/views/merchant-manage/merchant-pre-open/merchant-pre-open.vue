<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">提示</el-col>
        <el-col class="el-col-common annotation-red" :span="18">
          <div class="el-input-width">此流程只受理系统中已有的商户，未开通过预授权，结算规则必须为只对公，并且该商户预授权权限为可开通</div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <el-input id="merchantNumber" v-model="merchantPreOpen.merchantNumber" size="mini" />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">
          <el-button size="mini" type="primary">查询商户</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="merchantName" class="pointer">商户名称</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <el-input id="merchantName" v-model="merchantPreOpen.merchantName" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="registeredFund" class="pointer">注册资金</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <el-input id="registeredFund" v-model="merchantPreOpen.registeredFund" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">
          <label for="creditCardRate" class="pointer">贷记卡费率</label>
        </el-col>
        <el-col class="el-col-common" :span="6">
          <el-input id="creditCardRate" v-model="merchantPreOpen.creditCardRate" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">资质附件</el-col>
        <el-col class="el-col-common" :span="20">
          <div class="el-input-width">
            <el-upload
              ref="upload"
              class="upload-demo"
              action
              :file-list="merchantPreOpen.fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="primary">上传到服务器</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">提交</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./merchant-pre-open.js"></script>
<style lang="scss" src="./merchant-pre-open.scss" scoped></style>
