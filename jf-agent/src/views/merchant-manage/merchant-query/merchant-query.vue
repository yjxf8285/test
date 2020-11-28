<template>
  <div id="root">
    <div class="jf-main-content">
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">商户编号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.merchantNumber" placeholder="请输入商户编号" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">商户名称：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.merchantName" placeholder="请输入商户名称" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">商户状态：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.merchantState"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="开通" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">创建时间：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-date-picker
            class="fill-width"
            v-model="searchMsg.createDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">所属代理：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.agent" placeholder="请输入代理" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">手机号码：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.telephoneNumber" placeholder="请输入手机号码" size="mini" />
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
        <el-col :span="2" class="el-col-common el-col-title">开通日期：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-date-picker
            class="fill-width"
            v-model="searchMsg.openDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          />
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">所属区域：</el-col>
        <el-col :span="4" class="el-col-common">
          <!-- <el-select v-model="searchMsg.area" size="mini" placeholder="全部" class="fill-width">
            <el-option label value="1"></el-option>
          </el-select>-->
          <el-select
            v-model="searchMsg.area"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="全部"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">商户类型：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.merchantType"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="企业" value="1"></el-option>
            <el-option label="小微" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">身份证号：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-input v-model="searchMsg.idNumber" placeholder="请输入身份证号" size="mini" />
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">结算方式：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.clearingForm"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="秒到" value="1"></el-option>
            <el-option label="T+1" value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="2" class="el-col-common el-col-title">沉默商户：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select
            v-model="searchMsg.silenceMerchant"
            size="mini"
            placeholder="全部"
            class="fill-width"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-col-common el-col-title">支付宝报备：</el-col>
        <el-col :span="4" class="el-col-common">
          <el-select v-model="searchMsg.zfbReport" size="mini" placeholder="全部" class="fill-width">
            <el-option label="报备成功" value="1"></el-option>
            <el-option label="报备失败" value="2"></el-option>
            <el-option label="报备中" value="2"></el-option>
            <el-option label="待提交" value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button type="primary" size="medium">查询</el-button>
        <el-button type="primary" size="medium" @click="resetSearchMsg">重置</el-button>
      </div>
    </div>
    <div class="jf-main-content">
      <div class="output-apply">
        <a href="javascript:;">导出申请</a>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="merchantNumber" label="商户编号"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column prop="merchantState" label="商户状态"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="openDate" label="开通时间"></el-table-column>
        <el-table-column prop="telephoneNumber" label="手机号码"></el-table-column>
        <el-table-column prop="brand" label="品牌"></el-table-column>
        <el-table-column prop="agentNumber" label="所属代理编号"></el-table-column>
        <el-table-column prop="agentName" label="所属代理名称"></el-table-column>
        <el-table-column prop="area" label="所属地区"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="goDetail(scope.$index, scope.row)">详情</el-button>
            <!-- <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">绑机</el-button> -->
            <el-button size="mini" type="text" @click="zfbInfoModify=true">支付宝信息修改</el-button>
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
      <el-upload
        class="upload-demo"
        drag
        action="#"
        multiple
      >
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
<script src='./merchant-query.js'></script>
<style lang="scss" src='./merchant-query.scss' scoped></style>
