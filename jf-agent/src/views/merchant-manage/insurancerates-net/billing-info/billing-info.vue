<template>
  <div id="root">
    <div class="header">
      <div class="title">
        商户级结算规则
        <div class="btns">
          <i class="el-icon-plus" @click="addArticle" />
          <i class="el-icon-minus" @click="removeArticle" />
        </div>
      </div>
    </div>
    <div v-for="(item,index) in billingInfo" :key="index" class="content">
      <el-row class="el-row-common">
        <el-col class="el-col-common">
          <div class="content-title">结算卡{{ index+1 }}：</div>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">开户地：</el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-cascader
              v-model="item.openAccountArea"
              :options="areaOptions"
              size="mini"
              @change="handleChange"
            />
            <span class="star">*</span>
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">账户类型：</el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-select v-model="item.accountType" size="mini">
              <el-option
                v-for="(item,index) in accountTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >{{ item.label }}</el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">开户行：</el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-select v-model="item.openBank" size="mini">
              <el-option
                v-for="(item,index) in openBankOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >{{ item.label }}</el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label for="unionpayNumber" class="pointer">银联号：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <el-input id="unionpayNumber" v-model="item.unionpayNumber" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label for="branchInformation" class="pointer">支行信息：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <el-input id="branchInformation" v-model="item.branchInformation" size="mini" />
          <span class="star">*</span>
        </el-col>
        <!-- <el-col :span="4" class="el-col-common bg-blue"></el-col>
        <el-col :span="8" class="el-col-common"></el-col>-->
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label for="openAccountName" class="pointer">开户名：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <el-input id="openAccountName" v-model="item.openAccountName" size="mini" />
          <span class="star">*</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">辅助选项：</el-col>
        <el-col :span="8" class="el-col-common">
          <el-checkbox v-model="item.assist">
            <span class="annotation-red">多个关键字以空格分开，如未找到可勾选扩大范围查找</span>
          </el-checkbox>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label for="openAccountNumber" class="pointer">开户账号：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <el-input id="openAccountNumber" v-model="item.openAccountNumber" size="mini" />
          <span class="star">*</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label for="openAccountNumberCompare" class="pointer">确认开户账号：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <el-input
            id="openAccountNumberCompare"
            v-model="item.openAccountNumberCompare"
            size="mini"
          />
          <span class="star">*</span>
        </el-col>
      </el-row>
    </div>
    <div class="footer" />
  </div>
</template>
<script src="./billing-info.js"></script>
<style lang="scss" src="./billing-info.scss" scoped></style>
