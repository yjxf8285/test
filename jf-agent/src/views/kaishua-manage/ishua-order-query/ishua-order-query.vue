<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime : 2020-01-15 16:30:50
 * @LastEditors  : wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/my-info/my-info/my-info.vue
 -->
<template>
  <div class="my-info">

    <div class="jf-main-content">
      <div class="give-vip-content">
        <el-row type="flex" align="middle">
          <el-col :span="5" style="text-align:right">
            创建时间：
          </el-col>
          <el-col :span="7">
            <el-date-picker
              v-model="createTime"
              format="yyyy-MM-dd"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束如期"
              :picker-options="pickerOptions"
              style="width:260px"
            />
          </el-col>
          <el-col :span="5" style="text-align:right">
            机具号：
          </el-col>
          <el-col :span="7">
            <el-input v-model="type" size="small" />
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="5" style="text-align:right">
            商户编号：
          </el-col>
          <el-col :span="7">
            <el-input v-model="type" size="small" />
          </el-col>
          <el-col :span="5" style="text-align:right">
            活动类型：
          </el-col>
          <el-col :span="7">
            <el-select v-model="type" size="small">
              <el-option value="全部" />
            </el-select>
          </el-col>
        </el-row>

        <el-row type="flex" align="middle">
          <el-col :span="5" style="text-align:right">
            分支机构/销售联系电话：
          </el-col>
          <el-col :span="7">
            <el-input v-model="type" size="small" />
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top:30px;">
          <el-button type="primary" size="medium" plain>查询</el-button>
          <el-button size="medium" style="margin-left:20px;">重置</el-button>
        </el-row>

        <div class="query-total">
          <el-row type="flex" align="middle" justify="center">
            <el-col :span="6">交易总金额：0.0</el-col>
            <el-col :span="6">交易总笔数：0.0</el-col>
            <el-col :span="6">分润总金额：-- </el-col>
            <el-col :span="6">
              <el-button size="small" type="primary" plain>申请导出</el-button>
            </el-col>
          </el-row>
        </div>

      </div>
    </div>

  </div>
</template>

<script src="./ishua-order-query.js"></script>
<style lang="scss" src="./ishua-order-query.scss" scoped></style>
