<!--
 * @Author: wuyulong
 * @Date: 2019-12-26 14:50:26
 * @LastEditTime : 2020-01-02 16:04:25
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/merchant-batch-change/merchant-batch-change.vue
 -->
<template>
  <div class="merchant-batch-change">
    <!-- <div class="jf-main-title">
      <i class="el-icon-user" />
      商户产品查询
    </div> -->
    <div class="jf-main-content">
      <div class="merchant-batch-content">
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="4" style="font-size:14px;">商户编号</el-col>
              <el-col>
                <el-input v-model="customerNo" style="width:300px;" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="4" style="font-size:14px;">商户名称</el-col>
              <el-col :span="20">
                <el-input v-model="customerName" style="width:300px;" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row style="margin-top:30px;">
          <el-col :span="12">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="4" style="font-size:14px;">产品编号</el-col>
              <el-col>
                <el-input v-model="goodsCode" style="width:300px;" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="4" style="font-size:14px;">产品名称</el-col>
              <el-col :span="20">
                <el-input v-model="goodsName" style="width:300px;" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </div>
      <div class="merchant-batch-footer">
        <el-button type="primary" size="medium" @click="queryCustomer()">查询</el-button>
        <el-button size="medium" style="margin-left:20px;">重置</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./merchant-goods-query.scss" scoped></style>
<script src="./merchant-goods-query.js"></script>
