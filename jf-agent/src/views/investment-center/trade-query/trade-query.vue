<template>
  <div id="root">
    <!-- 条件搜索 -->
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="2" class="el-col el-col-title">交易日期：</el-col>
        <el-col :span="6" class="el-col input">
          <el-date-picker
            size="mini"
            v-model="searchMsg.tradeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="fill-width"
          ></el-date-picker>
        </el-col>
        <el-col :span="2" class="el-col"></el-col>
        <el-col :span="14" class="el-col input">
          <el-button size="mini" @click="getDate('today')">当日</el-button>
          <el-button size="mini" @click="getDate('yesterday')">昨日</el-button>
          <el-button size="mini" @click="getDate('thisweek')">本周</el-button>
          <el-button size="mini" @click="getDate('lastweek')">上周</el-button>
          <el-button size="mini" @click="getDate('thismonth')">本月</el-button>
          <el-button size="mini" @click="getDate('lastmonth')">上月</el-button>
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="3" class="el-col-title">交易金额：</el-col>
        <el-col :span="5" class="el-col-common">
          <el-input v-model="searchMsg.tradeMoney1" size="mini" placeholder="下限" />-
          <el-input v-model="searchMsg.tradeMoney2" size="mini" placeholder="上限" />
        </el-col>
        <el-col :span="3" class="el-col-title">所属品牌：</el-col>
        <el-col :span="5" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.brand" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.brandOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3" class="el-col-title">所属服务商：</el-col>
        <el-col :span="5" class="el-col-common">
          <el-input v-model="searchMsg.facilitator" size="mini" placeholder="请输入所属服务商" />
        </el-col>
      </el-row>

      <div class="btns">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary" @click="reset">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="jf-main-content">
      <div class="table-top-label">
        <div>
          <el-button type="text">查看合计</el-button>
        </div>
        <div>
          <el-button type="text">导出申请</el-button>
        </div>
      </div>

      <!-- table -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop label="交易日期"></el-table-column>
        <el-table-column prop label="所属品牌"></el-table-column>
        <el-table-column prop label="服务商编号"></el-table-column>
        <el-table-column prop label="服务商名称"></el-table-column>
        <el-table-column prop label="交易笔数"></el-table-column>
        <el-table-column prop label="交易金额（元）"></el-table-column>
        <el-table-column prop label="交易手续费（元）"></el-table-column>
        <el-table-column prop label="交易分润（元）"></el-table-column>
      </el-table>
    </div>

    <!-- dialog -->
  </div>
</template>
<script src="./trade-query.js"></script>
<style lang="scss" src="./trade-query.scss" scoped></style>
