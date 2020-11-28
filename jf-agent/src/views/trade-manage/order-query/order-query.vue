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
        <el-col :span="2" class="el-col-title">交易订单号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.tradeOrderNum" size="mini" placeholder="请输入交易订单号" />
        </el-col>
        <el-col :span="2" class="el-col-title">商户编号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.merchantNum" size="mini" placeholder="请输入商户编号" />
        </el-col>
        <el-col :span="2" class="el-col-title">终端序列号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.terminalSeriesNum" size="mini" placeholder="请输入终端序列号" />
        </el-col>
        <el-col :span="2" class="el-col-title">终端编号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.terminalNum" size="mini" placeholder="请输入终端编号" />
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="2" class="el-col-title">卡类型：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.cardType" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.cardTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">卡号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.cardNum" size="mini" placeholder="请输入卡号" />
        </el-col>
        <el-col :span="2" class="el-col-title">交易金额：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.tradeMoney1" size="mini" placeholder="下限" />-
          <el-input v-model="searchMsg.tradeMoney2" size="mini" placeholder="上限" />
        </el-col>
        <el-col :span="2" class="el-col-title">参考号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.refNum" size="mini" placeholder="请输入参考号" />
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="2" class="el-col-title">交易状态：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.tradeState" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.tradeStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">所属品牌：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.brand" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.brandOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">所属代理：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.agent" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.agentOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">交易类别：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.tradeClass" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.tradeClassOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="2" class="el-col-title">产品名称：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            class="fill-width"
            v-model="searchMsg.productionName"
            size="mini"
            placeholder="全部"
          >
            <el-option
              v-for="(item,index) in searchMsg.productionNameOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">交易类型：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.tradeType" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.tradeTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title">受理方式：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select class="fill-width" v-model="searchMsg.acceptWay" size="mini" placeholder="全部">
            <el-option
              v-for="(item,index) in searchMsg.acceptWayOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-title"></el-col>
        <el-col :span="4" class="el-col-common"></el-col>
      </el-row>

      <div class="btns">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
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
        <el-table-column prop label="交易订单号"></el-table-column>
        <el-table-column prop label="商户编号"></el-table-column>
        <el-table-column prop label="商户名称"></el-table-column>
        <el-table-column prop label="终端序列号"></el-table-column>
        <el-table-column prop label="终端号"></el-table-column>
        <el-table-column prop label="交易时间"></el-table-column>
        <el-table-column prop label="交易金额（元）"></el-table-column>
        <el-table-column prop label="交易类型"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="goDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- dialog -->
  </div>
</template>
<script src="./order-query.js"></script>
<style lang="scss" src="./order-query.scss" scoped></style>
