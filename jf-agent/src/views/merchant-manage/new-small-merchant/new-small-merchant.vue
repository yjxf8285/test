<!--
 * @Author: wuyulong
 * @Date: 2019-12-23 01:04:30
 * @LastEditTime: 2019-12-23 01:04:47
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /jf-agent/src/views/merchant-management/new-merchant/new-merchant.vue
 -->
<template>
  <div id="root">
    <div class="jf-main-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="table">
            <!-- 所属品牌 -->
            <div>
              <span class="annotation-red">*</span>所属品牌：
            </div>
            <div>
              <el-select size="mini" v-model="baseInfo.brand" class="fill-width">
                <el-option
                  v-for="(item,index) in baseInfo.brandOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>

            <!-- 商户名称 -->
            <div>
              <span class="annotation-red">*</span>商户名称：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.merchantName"></el-input>
            </div>

            <!-- 所属地区 -->
            <div>
              <span class="annotation-red">*</span>所属地区：
            </div>
            <div>
              <el-select size="mini" v-model="baseInfo.area" class="fill-width">
                <el-option
                  v-for="(item,index) in baseInfo.areaOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>

            <!-- 装机地址 -->
            <div>
              <span class="annotation-red">*</span>装机地址：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.machineAddress"></el-input>
            </div>

            <!-- 法人姓名 -->
            <div>
              <span class="annotation-red">*</span>法人姓名：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.legalPersonName"></el-input>
            </div>

            <!-- 法人身份证号 -->
            <div>
              <span class="annotation-red">*</span>法人身份证号：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.legalPersonNumber"></el-input>
            </div>

            <!-- 法人证件有效期 -->
            <div>
              <span class="annotation-red">*</span>法人证件有效期：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.legalIdDate1"></el-input>-
              <el-input size="mini" v-model="baseInfo.legalIdDate2"></el-input>
            </div>

            <!-- 法人手机号码 -->
            <div>
              <span class="annotation-red">*</span>法人手机号码：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.legalTelNumber"></el-input>
            </div>

            <!-- 所属下级账户 -->
            <div>
              <span class="annotation-red">*</span>所属下级账户：
            </div>
            <div>
              <el-select size="mini" v-model="baseInfo.subOrdinate" class="fill-width">
                <el-option
                  v-for="(item,index) in baseInfo.subOrdinateOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>

            <!-- 结算方式 -->
            <div>
              <span class="annotation-red">*</span>结算方式：
            </div>
            <div>
              <el-radio v-model="baseInfo.clearingForm" label="md">秒到</el-radio>
              <el-radio v-model="baseInfo.clearingForm" label="t1">T+1</el-radio>
            </div>

            <!-- 借记卡费率 -->
            <div>
              <span class="annotation-red">*</span>借记卡费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.debitCardRate"></el-input>
              <p class="annotation-grey">% 费率范围：0.53%~0.60%</p>
            </div>

            <!-- 封顶值 -->
            <div>
              <span class="annotation-red">*</span>封顶值：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.capValue"></el-input>
              <p class="annotation-grey">封顶范围：0.38%~0.60%</p>
            </div>

            <!-- 贷记卡费率 -->
            <div>
              <span class="annotation-red">*</span>贷记卡费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.creditCardRate"></el-input>
              <p class="annotation-grey">% 费率范围：0.53%~0.60%</p>
            </div>

            <!-- D0附加费率 -->
            <div>
              <span class="annotation-red">*</span>D0附加费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.d0Rate"></el-input>
              <p class="annotation-grey">% 费率范围：0.00%~0.10%</p>
            </div>

            <!-- 小额双免费率 -->
            <div>
              <span class="annotation-red">*</span>小额双免费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.littleRate"></el-input>
              <p class="annotation-grey">% 费率范围：0.38%~0.38%</p>
            </div>

            <!-- NFC移动支付费率 -->
            <div>
              <span class="annotation-red">*</span>NFC移动支付费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.nfcRate"></el-input>
              <p class="annotation-grey">% 费率范围：0.38%~0.38%</p>
            </div>

            <!-- 扫码支付费率 -->
            <div>
              <span class="annotation-red">*</span>扫码支付费率：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.payRate"></el-input>
              <p class="annotation-grey">% 费率范围：0.38%~0.60%</p>
            </div>
            <!-- 空行 -->
            <div></div>
            <div></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资质信息" name="second">
          <div class="aptitude-info">
            <!-- 点击上传身份证人像面 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传身份证人像面
              </div>
            </el-upload>

            <!-- 点击上传身份证国徽面 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传身份证国徽面
              </div>
            </el-upload>

            <!-- 点击上传法人手持身份证 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传法人手持身份证
              </div>
            </el-upload>

            <!-- 点击上传商户协议1 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传商户协议1
              </div>
            </el-upload>

            <!-- 点击上传商户协议2 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传商户协议2
              </div>
            </el-upload>

            <!-- 点击上传商户协议3 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传商户协议3
              </div>
            </el-upload>

            <!-- 点击上传商户协议4 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传商户协议4
              </div>
            </el-upload>

            <!-- 点击上传商户协议5 -->
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip">
                <span class="annotation-red">*</span>点击上传商户协议5
              </div>
            </el-upload>
            <div class="warm-prompt">
              <p>温馨提示：</p>
              <p>请使用jpeg或jpg格式文件上传，单个上传文件不能大于300K</p>
              <a href="javascript:;">商户协议下载</a>
              <a href="javascript:;">商户协议样例</a>
              <a href="javascript:;">图片压缩工具</a>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="结算信息" name="third">
          <div class="table">
            <!-- 账户类型 -->
            <div>账户类型：</div>
            <div>
              <el-input size="mini" v-model="billInfo.accountType"></el-input>
            </div>

            <!-- 开户名 -->
            <div>开户名：</div>
            <div>
              <el-input size="mini" v-model="billInfo.openName"></el-input>
            </div>

            <!-- 开户地 -->
            <div>
              <span class="annotation-red">*</span>开户地：
            </div>
            <div>
              <el-select size="mini" v-model="billInfo.openArea" class="fill-width">
                <el-option
                  v-for="(item,index) in baseInfo.openAreaOptions"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>

            <!-- 开户账号 -->
            <div>
              <span class="annotation-red">*</span>开户账号：
            </div>
            <div>
              <el-input size="mini" v-model="baseInfo.openId"></el-input>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="POS信息" name="fourth">
          <div class="table">
            <!-- 终端序列号 -->
            <div>终端序列号：</div>
            <div>
              <el-input size="mini" v-model="posInfo.terminalNumber"></el-input>
            </div>

            <!-- 空行 -->
            <div></div>
            <div></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btns">
        <el-button type="primary" @click="goBack">保存</el-button>
        <el-button type="primary" @click="goBack">提交</el-button>
      </div>
    </div>
  </div>
</template>
<style src="./new-small-merchant.scss" lang="scss" scoped></style>
<script src="./new-small-merchant.js"></script>
