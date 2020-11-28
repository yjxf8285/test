<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">服务商账号</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">服务商编号</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">服务商名称</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">服务商分润代发状态</el-col>
        <el-col class="el-col-common" :span="6">
          <el-select class="el-input-width" v-model="value1" size="mini">
            <el-option
              v-for="(item,index) in options1"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">运营分润代发状态</el-col>
        <el-col class="el-col-common" :span="6">
          <el-select class="el-input-width" v-model="value2" size="mini">
            <el-option
              v-for="(item,index) in options2"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium">重置</el-button>
        <el-button type="primary" size="medium">批量修改</el-button>
        <el-button type="primary" size="medium">数据导出</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="服务商账号">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorAccount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商编号">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商名称">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="代发比例">
          <template slot-scope="scope">
            <div>{{ scope.row.rate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商状态">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorState }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商备注">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorRemark }}</div>
          </template>
        </el-table-column>
        <el-table-column label="运营状态">
          <template slot-scope="scope">
            <div>{{ scope.row.operationState }}</div>
          </template>
        </el-table-column>
        <el-table-column label="运营备注">
          <template slot-scope="scope">
            <div>{{ scope.row.operationRemark }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div class="content">
          <el-row class="el-row">
            <el-col class="el-col-common" :span="6">服务商编号</el-col>
            <el-col class="el-col-common" :span="6">
              <el-input v-model="virtualData.facilitatorNumber" size="mini" />
            </el-col>
          </el-row>
          <el-row class="el-row">
            <el-col class="el-col-common" :span="6">代发状态:</el-col>
            <el-col class="el-col-common" :span="6">
              <el-select v-model="virtualData.operationState" size="mini">
                <el-option
                  v-for="(item,index) in options1"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="footer" />
  </div>
</template>
<script src="./share-profit-config.js"></script>
<style src="./share-profit-config.scss" lang="scss" scoped></style>
