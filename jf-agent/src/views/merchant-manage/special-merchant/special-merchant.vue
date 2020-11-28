<!--
 * @Author: wuyulong
 * @Date: 2019-12-26 16:35:57
 * @LastEditTime: 2020-02-21 16:03:29
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/merchant-management/special-merchant/special-merchant.vue
 -->
<template>
  <div class="preference-merchant">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">特惠类型</el-col>
        <el-col class="el-col-common" :span="20">
          <div class="el-input-width">
            <el-input size="small"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">上传文件</el-col>
        <el-col class="el-col-common" :span="20">
          <div class="el-input-width">
            <el-upload ref="upload" class="upload-demo" action>
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="primary">上传到服务器</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>

      <div class="preference-merchant-content">
        <div class="preference-merchant-view">
          <el-row type="flex">
            <el-col :span="12" />
            <el-col :span="12">
              <div class="preference-merchant-tip">
                <a href="##">开通模板下载</a>
                <span>特惠商户开通成功后，优惠策略将在5分钟后生效</span>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" style="padding:30px 0 20px;">
            <el-button size="medium" type="primary" @click="dialogVisible=true">批量开通</el-button>
          </el-row>
        </div>
      </div>

      <div class="jf-main-title">
        <i class="el-icon-s-unfold" />
        特惠商户开通历史
      </div>
      <div class="preference-merchant-content" style="margin-top:30px;">
        <div class="preference-merchant-view">
          <el-row type="flex" align="middle">
            <el-col :span="2">商户编号</el-col>
            <el-col :span="10">
              <el-input size="small" style="width:250px" />
            </el-col>
            <el-col :span="2">操作时间</el-col>
            <el-col :span="10">
              <el-date-picker
                size="small"
                v-model="doBegin"
                style="width:150px"
                type="date"
                placeholder="开始时间"
              />~
              <el-date-picker
                size="small"
                v-model="doEnd"
                style="width:150px"
                type="date"
                placeholder="结束时间"
              />
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" style="margin-top:30px;">
            <el-col :span="2">操作结果</el-col>
            <el-col :span="10">
              <el-select v-model="doResult" size="small">
                <el-option value="1" />
                <el-option value="1" />
                <el-option value="1" />
              </el-select>
            </el-col>
            <el-col :span="2">操作类型</el-col>
            <el-col :span="10">
              <el-select size="small" v-model="doType">
                <el-option value="1" />
                <el-option value="1" />
                <el-option value="1" />
              </el-select>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center" style="padding:30px 0 20px;">
            <el-button size="medium" type="primary">查询</el-button>
            <el-button size="medium">重置</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" src="./special-merchant.scss"></style>
<script src="./special-merchant.js"></script>
