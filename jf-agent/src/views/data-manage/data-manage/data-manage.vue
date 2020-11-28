<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-03-02 16:21:17
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/data-manage/data-manage/data-manage.vue
 -->
<template>
  <div class="my-info">

    <div class="jf-main-content">
      <div class="give-vip-content">

        <div class="form">
          <h1 style="margin-top:0">系统资料上传</h1>
          <table>
            <tr>
              <td class="left">文件类型：</td>
              <td>
                <el-select v-model="type" size="mini">
                  <el-option value="doc" />
                  <el-option value="excel" />
                </el-select>
              </td>
              <td class="left">上传文件：	</td>
              <td>
                <el-upload action="##">
                  <el-button size="mini" type="primary">选择文件上传</el-button>
                </el-upload>
              </td>
            </tr>
          </table>

          <el-row type="flex" justify="center" style="margin:30px 0 20px;">
            <el-button size="medium" type="primary" plain>上传资料</el-button>
          </el-row>

        </div>

        <div class="form">
          <h1>系统资料查询</h1>
          <table>
            <tr>
              <td class="left">文件名称：</td>
              <td>
                <el-input size="mini" />
              </td>
              <td class="left">文件类型：</td>
              <td>
                <el-select v-model="type" size="mini">
                  <el-option value="doc" />
                  <el-option value="excel" />
                </el-select>
              </td>
            </tr>
          </table>

          <el-row type="flex" justify="center" style="margin:30px 0 20px;">
            <el-button size="medium" type="primary" plain>查询</el-button>
            <el-button size="medium" style="margin-left:20px;">重置</el-button>
          </el-row>

        </div>

      </div>
    </div>

  </div>
</template>

<script src="./data-manage.js"></script>
<style lang="scss" src="./data-manage.scss" scoped></style>
