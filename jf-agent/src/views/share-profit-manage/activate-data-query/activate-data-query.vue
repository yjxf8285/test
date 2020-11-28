<template>
  <div id="root">
    <div class="jf-main-content">
      <div>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">
            <label class="pointer">激活商户编号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input size="mini" />
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">
            <label class="pointer">激活服务商编号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">
            <label class="pointer">归属服务商编号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input size="mini" />
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">
            <label class="pointer">归属服务商手机</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input size="mini" />
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">活动类型</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="type" size="mini">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">发放方式</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="type" size="mini">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">返现状态</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="type" size="mini">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">激活状态</el-col>
          <el-col :span="6" class="el-col-common">
            <el-select class="el-input-width" v-model="type" size="mini">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="el-row">
          <el-col :span="4" class="el-col-common el-col-title">
            <label class="pointer">POS序列号</label>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <el-input size="mini" />
          </el-col>
          <el-col :span="4" class="el-col-common el-col-title">激活日期</el-col>
          <el-col :span="6" class="el-col-common">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            />
          </el-col>
        </el-row>
      </div>
      <div class="footer">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./activate-data-query.js"></script>
<style lang="scss" src="./activate-data-query.scss" scoped></style>
