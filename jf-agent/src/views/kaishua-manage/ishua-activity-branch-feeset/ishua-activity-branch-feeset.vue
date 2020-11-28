<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 15:55:11
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/kaishua-manage/ishua-activity-branch-feeset/ishua-activity-branch-feeset.vue
 -->
<template>
  <div class="my-info">

    <div class="jf-main-content">
      <div class="give-vip-content">
        <el-tabs type="border-card">
          <el-tab-pane label="i刷2.0活动">

            <div class="form">
              <h1>I刷2.0活动机具费率设置</h1>
              <table>
                <tr>
                  <td class="left">服务商编号：</td>
                  <td>8624724627</td>
                  <td class="left">服务商名称：</td>
                  <td>自动化测试代理商入网18547227889</td>
                </tr>
                <tr>
                  <td class="left">默认费率：</td>
                  <td>
                    <el-input v-model="defaultFee" size="mini" />
                  </td>
                  <td class="left">费率说明：</td>
                  <td>费率范围：0.0055-0.0062</td>
                </tr>
                <tr>
                  <td class="left">二级服务商登录手机号：</td>
                  <td>
                    <el-input v-model="defaultFee" size="mini" />
                  </td>
                </tr>
              </table>
            </div>
            <el-row type="flex" justify="center" style="margin:30px 0 20px;">
              <el-button size="medium" type="primary" plain>保存</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="i刷1.0活动">

            <div class="form">
              <h1>I刷1.0活动机具费率设置</h1>
              <table>
                <tr>
                  <td class="left">服务商编号：</td>
                  <td>8624724627</td>
                  <td class="left">服务商名称：</td>
                  <td>自动化测试代理商入网18547227889</td>
                </tr>
                <tr>
                  <td class="left">默认费率：</td>
                  <td>
                    <el-input v-model="defaultFee" size="mini" />
                  </td>
                  <td class="left">费率说明：</td>
                  <td>费率范围：0.0055-0.0062</td>
                </tr>
              </table>
            </div>
            <el-row type="flex" justify="center" style="margin:30px 0 20px;">
              <el-button size="medium" type="primary" plain>保存</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="i刷MPOS回馈">

            <div class="form">
              <h1>MPOS回馈活动机具费率设置</h1>
              <table>
                <tr>
                  <td class="left">服务商编号：</td>
                  <td>8624724627</td>
                  <td class="left">服务商名称：</td>
                  <td>自动化测试代理商入网18547227889</td>
                </tr>
                <tr>
                  <td class="left">默认费率：</td>
                  <td>
                    <el-input v-model="defaultFee" size="mini" />
                  </td>
                  <td class="left">费率说明：</td>
                  <td>费率范围：0.0055-0.0062</td>
                </tr>
              </table>
            </div>
            <el-row type="flex" justify="center" style="margin:30px 0 20px;">
              <el-button size="medium" type="primary" plain>保存</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>

        <div class="form">
          <h1>分支机构修改费率查询</h1>
          <table>
            <tr>
              <td class="left">操作员手机号：</td>
              <td>
                <el-input v-model="defaultFee" style="width:300px;" size="mini" />
              </td>
            </tr>
          </table>
        </div>
        <el-row type="flex" justify="center" style="margin:30px 0 20px;">
          <el-button size="medium" type="primary" plain>查询</el-button>
        </el-row>

      </div>
    </div>

  </div>
</template>

<script src="./ishua-activity-branch-feeset.js"></script>
<style lang="scss" src="./ishua-activity-branch-feeset.scss" scoped></style>
