<template>
  <div id="root">
    <div class="header">
      <div>企业信息</div>
    </div>
    <div class="content">
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="companyInfoName">企业名称：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="companyInfoName"
              v-model="companyInfo.name"
              size="mini"
              placeholder="请输入商户全称"
            />
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">是否授权结算：</el-col>
        <el-col :span="8" class="el-col-common bg-blue-light">
          <el-radio v-model="companyInfo.hasAccept" label="否">否</el-radio>
          <el-radio v-model="companyInfo.hasAccept" label="是">是</el-radio>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">公司类型：</el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-select v-model="companyInfo.companyType" size="mini">
              <el-option
                v-for="(item,index) in [{value:0,name:'个体户'},{value:1,name:'有限责任公司'}]"
                :key="index"
                :label="item.name"
                :value="item.value"
              >{{ item }}</el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="businessNumber">营业执照号：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="businessNumber"
              v-model="companyInfo.businessNumber"
              size="mini"
              placeholder="请输入营业执照注册号"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="legalPerson">法人姓名：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="legalPerson"
              v-model="companyInfo.legalPerson"
              size="mini"
              placeholder="请输入法人姓名"
            />
          </div>
          <span class="star">*</span>
        </el-col>
        <el-col :span="4" class="el-col-common bg-blue">
          <label class="pointer" for="legalPersonId">法人身份证号：</label>
        </el-col>
        <el-col :span="8" class="el-col-common">
          <div class="el-input-common">
            <el-input
              id="legalPersonId"
              v-model="companyInfo.legalPersonId"
              size="mini"
              placeholder="法人身份证需与营业执照一致"
            />
          </div>
          <span class="star">*</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script src="./company-info.js"></script>
<style lang="scss" src="./company-info.scss" scoped></style
