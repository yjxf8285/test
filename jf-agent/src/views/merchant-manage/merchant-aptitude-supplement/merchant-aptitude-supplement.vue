<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input v-model="merchantKeyQuery.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantFullName" class="pointer">营业执照企业名称</label>
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
          <label for="telephoneNumber" class="pointer">营业执照编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="telephoneNumber" v-model="merchantKeyQuery.telephoneNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="telephoneNumber" class="pointer">注册地址</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input v-model="merchantKeyQuery.telephoneNumber" size="mini" />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">审核状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select v-model="merchantKeyQuery.state" class="el-input-width" size="mini">
            <el-option
              v-for="(item,index) in stateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="footer">
        <div>
          <el-button type="primary" size="medium">查询</el-button>
          <el-button type="primary" size="medium">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="商户编号"></el-table-column>
        <el-table-column label="商户名"></el-table-column>
        <el-table-column label="所属地区"></el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="所属销售"></el-table-column>
        <el-table-column label="开通日期"></el-table-column>
        <el-table-column label="状态"></el-table-column>
        <el-table-column label="是否沉默商户"></el-table-column>
        <el-table-column label="协议到达时间"></el-table-column>
        <el-table-column label="所属下级"></el-table-column>
        <el-table-column label="所属品牌"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./merchant-aptitude-supplement.js"></script>
<style lang="scss" src="./merchant-aptitude-supplement.scss" scoped></style>
