<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">分支机构账号</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">分支机构编号</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col class="el-col-common el-col-title" :span="4">分支机构名称</el-col>
        <el-col class="el-col-common" :span="6">
          <el-input size="mini" />
        </el-col>
        <el-col class="el-col-common el-col-title" :span="4">代发状态</el-col>
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
      <!-- <el-row class="el-row">
                <el-col class="el-col-common" :span="6">代发状态</el-col>
                <el-col class="el-col-common" :span="6">
                    <el-select size="mini" v-model="value1">
                        <el-option
                            v-for="(item,index) in options1"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
      </el-row>-->
      <div class="btns">
        <el-button type="primary" size="small">查询</el-button>
        <el-button type="primary" size="small">重置</el-button>
        <el-button type="primary" size="small">批量修改</el-button>
        <el-button type="primary" size="small">数组导出</el-button>
      </div>
      <el-table class="table-main" :data="tableData" style="width: 100%">
        <el-table-column label="分支机构账号">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorAccount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商编号">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="分支机构编号">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="代发比例">
          <template slot-scope="scope">
            <div>{{ scope.row.rate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="代发状态">
          <template slot-scope="scope">
            <div>{{ scope.row.facilitatorState }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <div>{{ scope.row.operationState }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="1000" />
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
  </div>
</template>
<script src="./facilitator-daily-share-config.js"></script>
<style src="./facilitator-daily-share-config.scss" lang="scss" scoped></style>
