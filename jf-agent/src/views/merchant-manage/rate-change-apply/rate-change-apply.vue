<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="merchantNumber" class="pointer">商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="merchantNumber" v-model="rateChange.merchantNumber" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <el-button type="primary" size="mini">商户查询</el-button>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">商户名称</el-col>
        <el-col :span="6" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">原商户类型</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">变更商户类型</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="rateChange.merchantType" size="mini">
            <el-option
              v-for="(item,index) in merchantTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前结算方式</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">变更结算方式</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="rateChange.modeOfPayment" size="mini">
            <el-option
              v-for="(item,index) in paymentOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前借记卡费率</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeDebitCardRate" class="pointer">变更借记卡费率</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="changeDebitCardRate"
              v-model="rateChange.changeDebitCardRate"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前贷记卡费率</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeCreditCardRate" class="pointer">变更贷记卡费率</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="changeCreditCardRate"
              v-model="rateChange.changeCreditCardRate"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前双免云闪付费率</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeCloudFlashPayRate" class="pointer">变更双免云闪付费率</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="changeCloudFlashPayRate"
              v-model="rateChange.changeCloudFlashPayRate"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前扫码支付费率</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeScanCodeRate" class="pointer">变更扫码支付费率</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input id="changeScanCodeRate" v-model="rateChange.changeScanCodeRate" size="mini" />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前计费方式</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">变更计费方式</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="rateChange.changeChargeMode" size="mini">
            <el-option
              v-for="(item,index) in chargeModeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前是否封顶</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeScanCodeRate" class="pointer">变更是否封顶</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-radio v-model="rateChange.currentCapping" label="1">否</el-radio>
            <el-radio v-model="rateChange.currentCapping" label="2">是</el-radio>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">当前借记卡封顶值</el-col>
        <el-col :span="6" class="el-col-common" />
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="changeDebitCardCapping" class="pointer">变更借记卡封顶值</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-width">
            <el-input
              id="changeDebitCardCapping"
              v-model="rateChange.changeDebitCardCapping"
              size="mini"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common">
          <div class="annotation-red">说明:变更扫码支付费率时不能同时变更商户类型或者结算方式</div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">提交</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="./rate-change-apply.scss" scoped></style>
<script src="./rate-change-apply.js"></script>
