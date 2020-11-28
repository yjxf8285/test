<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">
          <label for="processInstanceID" class="pointer">流程实例ID</label>
        </el-col>
        <el-col :span="6" class="el-col-common">
          <el-input
            id="processInstanceID"
            v-model="facilitatorShareInfoConfirm.processInstanceID"
            size="mini"
          />
        </el-col>
        <el-col :span="4" class="el-col-common el-col-title">单据状态</el-col>
        <el-col :span="6" class="el-col-common">
          <el-select
            class="el-input-width"
            v-model="facilitatorShareInfoConfirm.documentStateOptions"
            size="mini"
          >
            <el-option
              v-for="(item,index) in documentStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="4" class="el-col-common el-col-title">分润月份</el-col>
        <el-col :span="6" class="el-col-common">
          <el-date-picker
            v-model="facilitatorShareInfoConfirm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="medium" type="primary">查询</el-button>
        <el-button size="medium" type="primary">重置</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="流程实例"></el-table-column>
        <el-table-column label="分润月份"></el-table-column>
        <el-table-column label="应付保证金"></el-table-column>
        <el-table-column label="实付保证金"></el-table-column>
        <el-table-column label="总应付"></el-table-column>
        <el-table-column label="总应扣"></el-table-column>
        <el-table-column label="总实扣"></el-table-column>
        <el-table-column label="财务支付"></el-table-column>
        <el-table-column label="开票类型"></el-table-column>
        <el-table-column label="是否收到发票"></el-table-column>
        <el-table-column label="收款人名称"></el-table-column>
        <el-table-column label="单据状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script src="./facilitator-share-info-confirm.js"></script>
<style lang="scss" src="./facilitator-share-info-confirm.scss" scoped></style>
