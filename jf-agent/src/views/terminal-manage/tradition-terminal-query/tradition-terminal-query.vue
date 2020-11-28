<template>
  <div id="root">
    <div class="jf-main-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="POS查询" name="first"><pos-query /></el-tab-pane>
        <el-tab-pane label="批量变更机具活动配置" name="second"><change-config /></el-tab-pane>
        <el-tab-pane label="携机入库" name="third"><in-store /></el-tab-pane>
        <el-tab-pane label="机具活动变更" name="fourth"><activate-change /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script src="./tradition-terminal-query.js"></script>
<style lang="scss" src="./tradition-terminal-query.scss" scoped></style>
