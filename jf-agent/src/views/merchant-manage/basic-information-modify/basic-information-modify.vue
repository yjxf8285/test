<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantCode" class="pointer">商户编号：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="merchantCode" v-model="basicInformationModify.merchantCode" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button type="primary" size="mini">查询商户</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称：</el-col>
        <el-col :span="6" class="el-col-common">
          <div>12345</div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="linkMan" class="pointer">联系人：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="linkMan" v-model="basicInformationModify.linkMan" size="mini" />
          </div>
        </el-col>
        <el-col class="el-col-common el-col-title annotation-red" :span="10">
          <div class="el-input-width">请注意：您输入的联系人是汉字时长度不能超过十位</div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="shippingAddress" class="pointer">收货地址：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="shippingAddress"
              v-model="basicInformationModify.shippingAddress"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="email" class="pointer">电子邮箱：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="email" v-model="basicInformationModify.email" size="mini" />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="annotation" class="pointer">备注：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="annotation" v-model="basicInformationModify.annotation" size="mini" />
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">提交</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./basic-information-modify.js"></script>
<style lang="scss" src="./basic-information-modify.scss" scoped></style>
