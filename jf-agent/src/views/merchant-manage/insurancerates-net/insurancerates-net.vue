<template>
  <div id="root">
    <!-- <div class="header">
      <div class="jf-main-title">
        <i class="el-icon-s-shop" />保险费率商户入网
      </div>
    </div> -->
    <div class="content">
      <el-row class="el-row-common">
        <el-col :span="4" class="bg-blue first-row_col el-col-common">当前状态：</el-col>
        <el-col :span="5" class="bg-blue-light first-row_col el-col-common">待提交</el-col>
        <el-col :span="15" class="bg-blue-light first-row_col el-col-common">
          提示： ⊙ 提交审核时，
          <span class="star">*</span> 为必须填项。 ⊙ 保存时，请至少填写"商户全称"。
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col class="el-col-common bg-blue-light" :span="24">基本信息</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">商户类型：</el-col>
        <el-col :span="5" class="el-col-common bg-blue-light">
          <el-radio v-model="insuranceratesNet.merchantsType" label="企业">企业</el-radio>
          <el-radio v-model="insuranceratesNet.merchantsType" label="小微">小微</el-radio>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="merchantFullName">商户全称：</label>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="merchantFullName"
              v-model="insuranceratesNet.merchantFullName"
              size="mini"
              placeholder="请输入商户全称"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="receiptName">小票名称：</label>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="receiptName"
              v-model="insuranceratesNet.receiptName"
              size="mini"
              placeholder="请输入小票打印名称"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">所属区域：</el-col>
        <el-col :span="5" class="el-col-common">
          <div class="el-input-common">
            <el-cascader v-model="insuranceratesNet.merchantArea" size="mini" />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="businessAddress">经营地址：</label>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="businessAddress"
              v-model="insuranceratesNet.businessAddress"
              size="mini"
              placeholder="请输入有效地址以便于接收快递"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="merchantLinkMan">商户联系人：</label>
        </el-col>
        <el-col :span="5" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="merchantLinkMan"
              v-model="insuranceratesNet.merchantLinkMan"
              size="mini"
              placeholder="请输入商户联系人姓名"
            />
          </div>
          <span class="star">*</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="telephoneNumber">手机号码：</label>
        </el-col>
        <el-col :span="5" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="telephoneNumber"
              v-model="insuranceratesNet.telephoneNumber"
              size="mini"
              placeholder="请输入有效手机号以便接收短信"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">所属下级账户：</el-col>
        <el-col :span="5" class="el-col-common">
          <div class="el-input-common">
            <el-cascader v-model="insuranceratesNet.subAccount" size="mini" />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">机具分配名额：</el-col>
        <el-col :span="5" class="el-col-common bg-blue-light">2</el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">结算方式：</el-col>
        <el-col :span="5" class="el-col-common bg-blue-light">
          <el-radio v-model="insuranceratesNet.merchantsType" label="T+1">T+1</el-radio>
          <el-radio v-model="insuranceratesNet.merchantsType" label="秒到">秒到</el-radio>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">借记卡费率是否封顶：</el-col>
        <el-col :span="5" class="el-col-common bg-blue-light">
          <el-radio v-model="insuranceratesNet.merchantsType" label="是">是</el-radio>
          <el-radio v-model="insuranceratesNet.merchantsType" label="否">否</el-radio>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="debitCardRate">借记卡费率：</label>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <div class="el-input-common">
            <el-input id="debitCardRate" v-model="insuranceratesNet.debitCardRate" size="mini" />
          </div>
          <span class="star-mini">*</span>
          <span class="annotation">费率范围：0.0053-0.008</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="debitCardRateCap">借记卡费率封顶金额：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-common">
            <el-input id="debitCardRateCap" v-model="insuranceratesNet.debitCardRateCap" size="mini" />
          </div>元
          <span class="star-mini">*</span>
          <span class="annotation">建议：18-120</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="creditCardRate">贷记卡费率：</label>
        </el-col>
        <el-col :span="10" class="el-col-common">
          <div class="el-input-common">
            <el-input id="creditCardRate" v-model="insuranceratesNet.creditCardRate" size="mini" />
          </div>
          <span class="star-mini">*</span>
          <span class="annotation">费率范围：0.0053-0.008</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="codeToPayRate">扫码支付费率：</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <div class="el-input-common">
            <el-input id="codeToPayRate" v-model="insuranceratesNet.codeToPayRate" size="mini" />
          </div>
          <span class="star-mini">*</span>
          <span class="annotation">建议费率：0.0038-0.0038</span>
        </el-col>
      </el-row>
      <div class="article">
        <el-tabs v-model="elTabName" type="border-card" @tab-click="chooseTab">
          <el-tab-pane label="企业信息">
            <company-info />
          </el-tab-pane>
          <el-tab-pane label="资质上传">
            <aptitude-upload />
          </el-tab-pane>
          <el-tab-pane label="结算信息">
            <billing-info />
          </el-tab-pane>
          <el-tab-pane label="产品开通">
            <open-production />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" size="medium">保存</el-button>
      <el-button type="primary" size="medium">协议模板下载</el-button>
    </div>
  </div>
</template>
<script src='./insurancerates-net.js'></script>
<style lang="scss" src="./insurancerates-net.scss" scoped></style>
