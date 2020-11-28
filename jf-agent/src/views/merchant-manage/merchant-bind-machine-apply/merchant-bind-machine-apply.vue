<template>
  <div id="root">
    <div class="jf-main-content">
      <div class="table">
        <div>商户编号：</div>
        <div>
          <div class="input-width">
            <el-input width="50%" size="mini" placeholder="请输入商户编号"></el-input>
          </div>
          <el-button type="primary" size="mini" class="query">查询</el-button>
        </div>
        <div>商户名称：</div>
        <div></div>
        <div>归属品牌：</div>
        <div></div>
        <div>可绑定终端数量：</div>
        <div></div>
        <div>装机地址：</div>
        <div>
          <el-select value size="mini" class="input-width">
            <el-option value></el-option>
          </el-select>
        </div>
        <div>终端序列号：</div>
        <div>
          <div class="textarea-width">
            <el-input
              type="textarea"
              :autosize="{minRows:2,maxRows:4}"
              placeholder="注：如绑定多台POS，请在序列号之间用英文逗号分隔。如：81011357,23490981"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary">绑机</el-button>
        <el-button type="primary">重置</el-button>
      </div>
    </div>
  </div>
</template>
<style src="./merchant-bind-machine-apply.scss" lang="scss" scoped></style>
<script src="./merchant-bind-machine-apply.js"></script>