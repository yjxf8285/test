<!--
 * @Author: wuyulong
 * @Date: 2020-01-02 17:50:30
 * @LastEditTime: 2020-02-20 14:51:34
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/system-manage/scan-merchant-feeModel/scan-merchant-feeModel.vue
 -->
<template>
  <div class="function-manage">
    <div class="jf-main-content">
      <div class="function-manage-content">
        <el-row type="flex" align="middle">
          <el-col :span="2.5">ACTION名称：</el-col>
          <el-col :span="8">
            <el-input v-model="licenseNo" size="mini" />
          </el-col>
          <el-col :span="3" />
          <el-col :span="2.5">功能名称：</el-col>
          <el-col :span="8">
            <el-input v-model="licenseNo" size="mini" />
          </el-col>
        </el-row>

        <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
          <el-button type="primary" size="medium">查询</el-button>
          <el-button size="medium" style="margin:0 20px;">重置</el-button>
          <el-button type="success" size="medium" plain @click="showFunction()">新增功能</el-button>
        </el-row>

        <div v-if="showAdd" class="addFunction">
          <el-row type="flex" align="middle">
            <el-col :span="2.5">功能名称：</el-col>
            <el-col :span="8">
              <el-input v-model="licenseNo" size="mini" />
            </el-col>
            <el-col :span="3" />
            <el-col :span="2.5">ACTION：</el-col>
            <el-col :span="8">
              <el-input v-model="licenseNo" size="mini" />
            </el-col>
          </el-row>

          <el-row type="flex" align="middle">
            <el-col :span="2.5">是否验证：</el-col>
            <el-col :span="8">
              <el-select v-model="isCheck" size="mini">
                <el-option value="是" />
                <el-option value="否" />
              </el-select>
            </el-col>
            <el-col :span="3" />
            <el-col :span="2.5">状态：</el-col>
            <el-col :span="8">
              <el-select v-model="isCheck" size="mini">
                <el-option value="是" />
                <el-option value="否" />
              </el-select>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle">
            <el-col :span="2.5">备注：</el-col>
            <el-col :span="8">
              <el-input v-model="licenseNo" type="textarea" />
            </el-col>
            <el-col :span="3" />
            <el-col :span="2.5" />
            <el-col :span="8" />
          </el-row>

          <el-row type="flex" align="middle" justify="center" style="margin-top:40px;">
            <el-button type="primary" size="medium">查询</el-button>
            <el-button size="medium" style="margin:0 20px;">重置</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./scan-merchant-feemodel.scss" scoped></style>
<script src="./scan-merchant-feemodel.js"></script>
