<!--
 * @Author: wuyulong
 * @Date: 2020-01-08 14:38:18
 * @LastEditTime: 2020-02-20 16:00:47
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/views/finance-manage/unionPay-recovery-query/unionPay-recovery-query.vue
 -->
<template>
  <div class="my-info">
    <div class="jf-main-content">
      <div class="give-vip-content">
        <div class="form">
          <table>
            <tr>
              <td class="left">商户编号：</td>
              <td>
                <el-input v-model="defaultFee" size="mini" />
              </td>
              <td class="left">商户名称：</td>
              <td>
                <el-input v-model="defaultFee" size="mini" />
              </td>
              <td class="left">清算罚款月份：</td>
              <td>
                <el-date-picker
                  v-model="examineTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="mini"
                  style="width:230px"
                />
              </td>
            </tr>
            <tr>
              <td class="left">所属二级：</td>
              <td>
                <el-input v-model="defaultFee" size="mini" />
              </td>
              <td class="left">二级销售：</td>
              <td>
                <el-input v-model="defaultFee" size="mini" />
              </td>
            </tr>
          </table>

          <el-row type="flex" justify="center" style="margin:30px 0 20px;">
            <el-button size="medium" type="primary" plain>查询</el-button>
            <el-button size="medium" style="margin-left:20px;">重置</el-button>
          </el-row>

          <div class="query-total">
            <el-row type="flex">
              <el-col>
                <el-button size="medium" type="primary" plain>查看合计</el-button>
              </el-col>
              <el-col>涉及商户数： 0</el-col>
              <el-col>追偿总金额（元）： 0.0</el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./unionpay-recovery-query.js"></script>
<style lang="scss" src="./unionpay-recovery-query.scss" scoped></style>
