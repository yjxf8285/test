<!--
 * @Author: wuyulong
 * @Date: 2019-12-19 17:38:02
 * @LastEditTime: 2020-02-21 15:36:26
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/merchant-management/self-modify/self-modify.vue
 -->
<template>
  <div class="self-modify">
    <div class="jf-main-content">
      <div class="self-modify-head">
        <p>
          <span>商户编号</span>
        </p>
        <p>
          <el-input
            size="small"
            v-model="customerNo"
            placeholder="请输入商户编号"
            auto-complete="on"
            name="customerNo"
          />
        </p>
        <p>
          <el-button type="submit" @click="submitQuery()">商户查询</el-button>
        </p>
      </div>
      <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog> -->
    </div>
  </div>
</template>

<style lang="scss" src="./self-modify.scss"></style>
<script src="./self-modify.js"></script>
