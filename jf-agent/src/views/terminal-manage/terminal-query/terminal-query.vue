<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">终端序列号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.terminalSeriesNumber" placeholder="请输入终端序列号" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">终端号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.terminalNumber" placeholder="请输入终端号" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">商户编号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.merchantNumber" placeholder="请输入商户编号" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">所属代理商：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.agent" placeholder="请输入所属代理商" size="mini" />
        </el-col>
      </el-row>

      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">状态：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select v-model="searchMsg.state" size="mini" placeholder="全部" class="fill-width">
            <el-option label="未分配" value="1"></el-option>
            <el-option label="已分配" value="2"></el-option>
            <el-option label="已绑定" value="3"></el-option>
            <el-option label="已占用" value="4"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">是否可交易：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select v-model="searchMsg.isTrade" size="mini" placeholder="全部" class="fill-width">
            <el-option label="可交易" value="1"></el-option>
            <el-option label="不可交易" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">所属品牌：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select v-model="searchMsg.brand" size="mini" placeholder="全部" class="fill-width">
            <el-option label="点付" value="1"></el-option>
            <el-option label="开刷" value="2"></el-option>
            <el-option label="趣付传统" value="3"></el-option>
            <el-option label="趣付电签" value="4"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">所属活动：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select v-model="searchMsg.activity" size="mini" placeholder="全部" class="fill-width">
            <el-option label="活动" value="1"></el-option>
            <el-option label="活动" value="2"></el-option>
            <el-option label="活动" value="3"></el-option>
            <el-option label="活动" value="4"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">变更活动：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.changeActivity"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="支持" value="1"></el-option>
            <el-option label="不支持" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">激活状态：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.activateState"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="已激活" value="1"></el-option>
            <el-option label="未激活" value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium" @click="resetSearchMsg">重置</el-button>
      </div>
    </div>
    <div class="jf-main-content">
      <div class="table-top-label">
        <div>
          <el-button type="text">活动变更及活动规则变更</el-button>
        </div>
        <div>
          <el-button type="text">导出申请</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="终端序列号"></el-table-column>
        <el-table-column prop="" label="终端号"></el-table-column>
        <el-table-column prop="" label="型号"></el-table-column>
        <el-table-column prop="" label="所属服务商编号"></el-table-column>
        <el-table-column prop="" label="所属服务商名称"></el-table-column>
        <el-table-column prop="" label="所属商户编号"></el-table-column>
        <el-table-column prop="" label="所属商户名称"></el-table-column>
        <el-table-column prop="" label="装机地址"></el-table-column>
        <el-table-column prop="" label="状态"></el-table-column>
        <el-table-column prop="" label="是否可交易"></el-table-column>
        <el-table-column prop="" label="品牌"></el-table-column>
        <el-table-column prop="" label="活动类型"></el-table-column>
        <el-table-column prop="" label="系统接入费-返现"></el-table-column>
        <el-table-column prop="" label="激活状态"></el-table-column>
        <el-table-column prop="" label="激活到期时间"></el-table-column>
        <el-table-column prop="" label="剩余激活天数"></el-table-column>
        <el-table-column prop="" label="变更活动"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="goDetail(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini" type="text" >撤机</el-button>
            <el-button size="mini" type="text" >活动规则变更</el-button>
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        layout="total, prev, pager, next, jumper"
        :total="400"
        background
        class="pagination"
      ></el-pagination>
      <!-- <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination> -->
    </div>
    <!-- 支付宝信息修改 -->
    <el-dialog title="上一次报备失败原因：xxxxxx" :visible.sync="zfbInfoModify" width="30%" center>
      <el-upload class="upload-demo" drag action="#" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="zfbInfoModify = false">取 消</el-button>
        <el-button type="primary" @click="zfbInfoModify = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 支付宝资料补充 -->
    <el-dialog title="提示" :visible.sync="zfbDataSupplement" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src='./terminal-query.js'></script>
<style lang="scss" src='./terminal-query.scss' scoped></style>
