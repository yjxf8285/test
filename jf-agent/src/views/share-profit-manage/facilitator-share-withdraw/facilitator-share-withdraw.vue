<template>
  <div id="root">
    <div class="jf-main-content">
      <div class="title">
        <el-radio v-model="radio" label="1">
          <i class="el-icon-search" />服务商分润提现
        </el-radio>
        <el-radio v-model="radio" label="2">
          <i class="el-icon-search" />提现记录查询
        </el-radio>
      </div>
      <transition enter-active-class="animated bounceInLeft">
        <div v-if="radio==1" key="1">
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">提示</el-col>
            <el-col :span="6" class="el-col-common">
              <span class="annotation-red">请及时寄送月结发票,避免提现功能无法使用</span>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">分润月份</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">
              <el-button type="primary" size="mini">查询</el-button>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">分润金额</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">分润金额明细</el-col>
            <el-col :span="6" class="el-col-common">124</el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">最大提现额</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">最大提现明细</el-col>
            <el-col :span="6" class="el-col-common">124</el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">已提现分润</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">已提现明细</el-col>
            <el-col :span="6" class="el-col-common">124</el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">已到账提现分润</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">未到账提现分润</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">当前可提现分润</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">结算服务商编号</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">结算卡类型</el-col>
            <el-col :span="6" class="el-col-common">
              <el-radio>对公</el-radio>
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">开户名</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">本次提取金额</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common el-col-title">单次最小提现额</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
            <el-col :span="4" class="el-col-common el-col-title">单次最大提现额</el-col>
            <el-col :span="6" class="el-col-common">
              <el-input size="mini" />
            </el-col>
          </el-row>
          <div class="footer">
            <el-button type="primary" size="medium">提交</el-button>
            <el-button type="primary" size="medium">取消</el-button>
          </div>
        </div>
        <div v-else key="2">
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common*">业务时间</el-col>
            <el-col :span="6" class="el-col-common">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common*">创建付款单时间</el-col>
            <el-col :span="6" class="el-col-common">
              <el-date-picker
                v-model="value2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col :span="4" class="el-col-common*">发放方式</el-col>
            <el-col :span="6" class="el-col-common">
              <el-select v-model="provide" size="mini">
                <el-option
                  v-for="(item,index) in options1"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="4" class="el-col-common*">提现状态</el-col>
            <el-col :span="6" class="el-col-common">
              <el-select v-model="withdrawState" size="mini">
                <el-option
                  v-for="(item,index) in options2"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
          <div class="footer">
            <el-button type="primary" size="medium">查询</el-button>
            <el-button type="primary" size="medium">重置</el-button>
            <el-button type="primary" size="medium">查看合计</el-button>
            <el-button type="primary" size="medium">数据导出</el-button>
          </div>
        </div>
      </transition>
    </div>
    <div class="footer" />
  </div>
</template>
<script src="./facilitator-share-withdraw.js"></script>
<style lang="scss" src="./facilitator-share-withdraw.scss" scoped></style>
