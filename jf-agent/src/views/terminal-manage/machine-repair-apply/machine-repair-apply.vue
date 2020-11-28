<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">POS序列号编号</el-col>
        <el-col :span="6" class="el-col-common">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">是否自备机</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">是否质保期</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">机具型号</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">快递公司</el-col>
        <el-col :span="10" class="el-col-common">
          <el-select class="el-input-width" size="mini" value="123">
            <el-option label="123" value="123" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">快递单号</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">回寄联系人</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">回寄联系电话</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">回寄地址</el-col>
        <el-col :span="10" class="el-col-common" />
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">问题描述</el-col>
        <el-col :span="10" class="el-col-common">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary" @click="dialogVisible=true">提交</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
      <div class="annotation-red">
        <div>温馨提示</div>
        <div>1.机具在质保期内免费维修。</div>
        <div>2.自备机和超出质保期的POS机收取维修费50元。</div>
        <div>3.如果机具进行过恶意篡改，则一律收取维修费100元。</div>
        <div>4.已返厂的机具会由厂商收取费用，查看费用证明直接向厂商缴纳所需费用。</div>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script src="./machine-repair-apply.js"></script>
<style lang="scss" src="./machine-repair-apply.scss" scoped></style>
