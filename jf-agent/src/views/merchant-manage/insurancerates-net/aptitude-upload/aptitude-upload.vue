<template>
  <div id="root">
    <div class="header">
      <div class>资质上传</div>
    </div>
    <div class="content">
      <el-row v-for="(item,index) in aptitudeUpload" :key="index" class="el-row-common">
        <el-col :span="6" class="el-col-common bg-blue">
          {{ item.label }}
          <span class="star">*</span>：
        </el-col>
        <el-col :span="18" class="el-col-common">
          <el-upload
            class="upload-demo"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="item.fileList"
          >
            <button class="upLoad-button">
              选择文件
              <i class="el-icon-upload el-icon--right" />
            </button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="el-row-common">
        <el-col :span="6" class="el-col-common bg-blue">其他资质信息</el-col>
        <el-col :span="18" class="el-col-common">
          <div style="width:100%;display:flex;justify-content:flex-start;">
            <button class="otherInfo-button" @click="toggleShow">{{ otherInfoButton }}</button>
          </div>
        </el-col>
      </el-row>
      <div v-show="hasShow" class="otherInfo">
        <el-row v-for="(item,index) in otherInfoUpload" :key="index" class="el-row-common">
          <el-col :span="6" class="el-col-common bg-blue">{{ item.label+"：" }}</el-col>
          <el-col :span="12" class="el-col-common">
            <el-upload
              class="upload-demo"
              action
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="item.fileList"
            >
              <button class="upLoad-button">
                选择文件
                <i class="el-icon-upload el-icon--right" />
              </button>
            </el-upload>
          </el-col>
          <el-col :span="6" class="el-col-common">
            <span class="annotation-red">{{ item.annotation }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="footer">
      <el-row class="el-last-row">
        <el-col :span="5" class="bg-blue el-last-col">特殊说明：</el-col>
        <el-col :span="19" class="el-last-col">
          <div>
            <div>1. 请使用jpeg或jpg格式文件上传，单个上传文件不能大于300K</div>
            <div>2. 门头照片、收银台照片、经营场景照片每种至少上传一张，最多可上传三张</div>
            <div class="ul">
              3. 特殊资质要求：
              <div class="li">(1).体现甲乙双方名称和地址信息；</div>
              <div class="li">(2).体现有效期信息；</div>
              <div class="li">(3).落款签字、日期和盖章信息</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script src="./aptitude-upload.js"></script>
<style lang="scss" src="./aptitude-upload.scss" scoped></style>
