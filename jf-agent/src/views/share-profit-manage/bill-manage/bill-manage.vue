<template>
  <div id="root">
    <div class="jf-main-content">
      <div v-if="toggleShow">
        <el-row class="el-row-common">
          <el-col :span="4" class="el-col-common el-col-title">开票日期</el-col>
          <el-col :span="6" class="el-col-common">
            <el-date-picker
              v-model="billManagement.makeBillDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">
            <label for="billNumber" class="pointer">发票编号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="billNumber" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <el-col :span="4" class="el-col-common el-col-title">发票使用状态</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="billManagement.billState" size="mini">
              <el-option
                v-for="(item,index) in billStateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">审核状态</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="billManagement.auditState" size="mini">
              <el-option
                v-for="(item,index) in auditStateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row class="el-row-common">
          <el-col :span="6" class="el-col-common el-col-title">
            <label for="billCode" class="pointer">发票代码</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="billCode" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <el-col :span="6" class="el-col-common el-col-title">
            <label for="billNumber" class="pointer">发票编号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="billNumber" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <el-col :span="6" class="el-col-common el-col-title">
            <label for="billMoney" class="pointer">
              发票金额
              <span class="annotation-red">(发票金额为不含税金额)</span>
            </label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="billMoney" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <el-col :span="6" class="el-col-common el-col-title">
            <label for="afterSixCode" class="pointer">
              发票后六位验证码
              <span class="annotation-red">(增值税专用票不需要填写)</span>
            </label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input id="afterSixCode" size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <el-col :span="6" class="el-col-common el-col-title">发票日期</el-col>
          <el-col :span="6" class="el-col-common">
            <el-date-picker
              v-model="billManagement.makeBillDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </el-col>
        </el-row>
        <el-row class="el-row-common">
          <span class="annotation-red">发票保存后会通过国税系统验证，约30秒返回结果，请耐心等待</span>
        </el-row>
      </div>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="toggleShow=!toggleShow"
        >{{ toggleShow?"验证发票":"返回" }}</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./bill-manage.js"></script>
<style lang="scss" src="./bill-manage.scss" scoped></style>
