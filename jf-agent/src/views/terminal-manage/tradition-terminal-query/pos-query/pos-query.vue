<template>
  <div id="root">
    <div class="content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for>终端号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for>序列号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="state" size="mini">
            <el-option
              v-for="(item,index) in stateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">使用方式</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="useMode" size="mini">
            <el-option
              v-for="(item,index) in useModeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for>软件版本</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">
          <label for>参数版本</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for>商户编号</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">活动类型</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="activateType" size="mini">
            <el-option
              v-for="(item,index) in activateTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">品牌</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="state" size="mini">
            <el-option
              v-for="(item,index) in brandOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">激活状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="activateState" size="mini">
            <el-option
              v-for="(item,index) in activateStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="6" class="el-col-common el-col-title">参与趣付传统pos携机活动</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select class="el-input-width" v-model="partPos" size="mini">
            <el-option
              v-for="(item,index) in partPosOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" size="medium">查询</el-button>
      <el-button type="primary" size="medium">重置</el-button>
    </div>
  </div>
</template>
<script src="./pos-query.js"></script>
<style lang="scss" src="./pos-query.scss" scoped></style>
