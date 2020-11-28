<!--
 * @Author: wuyulong
 * @Date: 2020-02-20 13:11:12
 * @LastEditTime: 2020-02-21 16:54:56
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/account-management/my-debit-card/my-debit-card.vue
 -->
<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">账户类型：</el-col>
        <el-col class="el-col-common left" :span="10">对公</el-col>
        <el-col class="el-col-common right" :span="2">开户名：</el-col>
        <el-col class="el-col-common left" :span="10">123458dfgh</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">开户行：</el-col>
        <el-col class="el-col-common left" :span="10">
          <div v-if="isEdit">
            <el-cascader
              ref="bank"
              v-model="virtualData.openingBank"
              :options="bankOptions"
              :props="{ expandTrigger: 'hover' }"
              size="mini"
              @change="changeBank"
            />
          </div>
          <div v-else>{{ myDebitCard.openingBankLabel }}</div>
        </el-col>
        <el-col class="el-col-common right" :span="2">开户账号：</el-col>
        <el-col class="el-col-common left" :span="10">822589*****0909</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">所属省：</el-col>
        <el-col class="el-col-common left" :span="10">
          <div v-if="isEdit">
            <el-cascader
              ref="area"
              v-model="virtualData.city"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover' }"
              size="mini"
              @change="changeCity"
            />
          </div>
          <div v-else>{{ myDebitCard.cityLabel }}</div>
        </el-col>
        <el-col class="el-col-common right" :span="2">所属地区：</el-col>
        <el-col class="el-col-common left" :span="10">市辖区</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">清分行号：</el-col>
        <el-col class="el-col-common left" :span="10">102100099998</el-col>
        <el-col class="el-col-common right" :span="2">联行号：</el-col>
        <el-col class="el-col-common left" :span="10">102100099988</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">生效时间：</el-col>
        <el-col class="el-col-common left" :span="10">2018-07-25 00:00</el-col>
        <el-col class="el-col-common right" :span="2">失效时间：</el-col>
        <el-col class="el-col-common left" :span="10">2099-12-31 00:00</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common right" :span="2">状态：</el-col>
        <el-col class="el-col-common left" :span="10">可用</el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button v-if="!isEdit" plain size="medium" @click="isEdit=true">修改</el-button>
        <div v-else>
          <el-button plain size="medium" @click="confirm">确认修改</el-button>
          <el-button plain size="medium" @click="cancel">取消</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script src="./my-debit-card.js"></script>
<style lang="scss" src="./my-debit-card.scss" scoped></style>
