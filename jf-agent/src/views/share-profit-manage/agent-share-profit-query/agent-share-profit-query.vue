<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="facilitatorAccount" class="pointer">服务商账号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="facilitatorAccount" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="facilitatorCode" class="pointer">服务商编码</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="facilitatorCode" size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="facilitatorName" class="pointer">服务商名称</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input id="facilitatorName" size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">入账状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select v-model="agentShareProfitQuery.enterState" size="mini">
            <el-option
              v-for="(item,index) in enterStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">运营状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select v-model="agentShareProfitQuery.operationState" size="mini">
            <el-option
              v-for="(item,index) in operationStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">服务商状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select v-model="agentShareProfitQuery.facilitatorState" size="mini">
            <el-option
              v-for="(item,index) in facilitatorStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="el-col-common el-col-title">日期</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="agentShareProfitQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="btns">
        <el-button type="primary" size="small">查询</el-button>
        <el-button type="primary" size="small">查询合计</el-button>
      </div>
      <div class="table">
        <el-table :data="tableData" height="250" border style="width: 100%">
          <el-table-column prop label="日期" align="center" />
          <el-table-column prop label="服务商账号" />
          <el-table-column prop label="服务商编号" />
          <el-table-column prop label="服务商名称" />
          <el-table-column prop label="交易金额" />
          <el-table-column prop label="交易笔数" />
          <el-table-column prop label="手续费" />
          <el-table-column prop label="交易分润" />
          <el-table-column prop label="代发比例" />
          <el-table-column prop label="入账金额" />
          <el-table-column prop label="入账状态" />
          <el-table-column prop label="运营状态" />
          <el-table-column prop label="代理状态" />
          <el-table-column prop label="备注" />
        </el-table>
        <el-pagination class="pagination" background layout="prev, pager, next" :total="1000" />
      </div>
    </div>
    <div class="footer" />
  </div>
</template>
<script src="./agent-share-profit-query.js"></script>
<style lang="scss" src="./agent-share-profit-query.scss" scoped></style>
