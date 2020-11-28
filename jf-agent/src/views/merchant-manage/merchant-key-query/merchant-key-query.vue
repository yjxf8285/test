<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="merchantNumber" v-model="merchantKeyQuery.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantFullName" class="pointer">商户全称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="merchantFullName"
              v-model="merchantKeyQuery.merchantFullName"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="telephoneNumber" class="pointer">手机号码</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="telephoneNumber" v-model="merchantKeyQuery.telephoneNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="merchantKeyQuery.state" size="mini">
            <el-option
              v-for="(item,index) in stateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">开通时间</el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-date-picker
              v-model="merchantKeyQuery.openDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="商户编号"></el-table-column>
        <el-table-column label="商户名"></el-table-column>
        <el-table-column label="所属地区"></el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="所属销售"></el-table-column>
        <el-table-column label="开通日期"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="商户密钥" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">MD5</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">RSA</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./merchant-key-query.js"></script>
<style lang="scss" src="./merchant-key-query.scss" scoped></style>
