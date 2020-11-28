<!--
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2019-12-19 10:10:58
 * @LastEditors: wuyulong
 * @LastEditTime: 2020-04-29 17:27:41
 -->
<template>
  <div class="index">
    <!-- 便签显示栏目 -->
    <div class="index-banner">
      <div class="index-banner-data-count">
        <span>数据统计</span>
        <el-select size="mini" v-model="dataCount" @change="changeBrand">
          <el-option
            v-for="item in dataCountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="index-banner-wrap">
        <div class="index-banner-item">
          <div class="banner-item-title">
            <img src="./image/icon_homepage_trade.png" alt />
            交易
          </div>
          <table>
            <tr>
              <td class="left" width="90">本月交易：</td>
              <td class="right">{{currentMonthTrade}}元</td>
            </tr>
            <tr>
              <td class="left">昨日交易：</td>
              <td class="right">{{yesterdayTrade}}笔</td>
            </tr>
            <!-- <tr>
              <td class="left">昨日平均交易：</td>
              <td>12831.11元</td>
            </tr>-->
          </table>
        </div>
        <div class="index-banner-item">
          <div class="banner-item-title">
            <img src="./image/icon_homepage_treasure.png" alt />
            收益
          </div>
          <table>
            <tr>
              <td class="left" width="90">本月收益：</td>
              <td class="right">0</td>
            </tr>
            <tr>
              <td class="left">昨日收益：</td>
              <td class="right">6</td>
            </tr>
            <!-- <tr>
              <td class="left">审核中商户：</td>
              <td>12</td>
            </tr>
            <tr>
              <td class="left">已开通商户：</td>
              <td>123</td>
            </tr>-->
          </table>
        </div>
        <div class="index-banner-item">
          <div class="banner-item-title">
            <img src="./image/icon_homepage_interminal.png" alt />
            终端
          </div>
          <table>
            <tr>
              <td class="left" width="80">本月激活：</td>
              <td class="right">0</td>
            </tr>
            <tr>
              <td class="left">昨日激活：</td>
              <td class="right">6</td>
            </tr>
          </table>
        </div>
        <div class="index-banner-item">
          <div class="banner-item-title">
            <img src="./image/icon_homepage_customer.png" alt />
            商户
          </div>
          <table>
            <tr>
              <td class="left" width="80">本月新增：</td>
              <td class="right">0</td>
            </tr>
            <tr>
              <td class="left" width="80">昨日新增：</td>
              <td class="right">50个</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 便签显示栏目 -->
    <!-- 首页内容显示区域 -->
    <div class="index-content">
      <div class="item">
        <div class="item-title">
          <p>我的任务</p>
          <span>
            更多
            <img src="./image/icon_homepage_next.png" alt />
          </span>
        </div>
        <div class="index-task">
          <div class="index-task-item">
            <router-link to="/">
              商户企业信息变更
              <span class="unread-count">(12)</span>
            </router-link>
          </div>
          <div class="index-task-item">
            <router-link to="/">
              商户企业信息变更
              <span class="unread-count">(12)</span>
            </router-link>
          </div>
          <div class="index-task-item">
            <router-link to="/">
              商户企业信息变更
              <span class="unread-count">(12)</span>
            </router-link>
          </div>
          <!-- <div class="index-task-header">
            <p :class="{'active':isReceived}" @click="queryReceived()">已领取任务</p>
            <span />
            <p :class="{'active':!isReceived}" @click="queryUnreceive()">未领取任务</p>
          </div>
          <div class="index-task-content">
            <p v-if="isReceived">
              <router-link to="/">1、所有服务商代理商按地区、服务商发布 NEW~</router-link>
              <router-link to="/">2、所有服务商代理商按地区、服务商发布 NEW~</router-link>
              <router-link to="/">3、所有服务商代理商按地区、服务商发布 NEW~</router-link>
            </p>
            <p v-if="!isReceived" class="hasNoData">没有未领取的任务</p>
          </div>-->
        </div>
      </div>

      <div class="item">
        <div class="item-title">
          <p>业务公告</p>
          <span>
            更多
            <img src="./image/icon_homepage_next.png" alt />
          </span>
        </div>
        <div class="index-task">
          <div
            class="index-task-item"
            v-for="(item,index) in bussinessNoticeOptions"
            :key="index"
            @click="item.readState=true"
          >
            <router-link to="/">
              <span class="unread-state-no" :class="{'unread-state-yes':item.readState}"></span>
              {{item.value}}
              <span class="detail">详情</span>
            </router-link>
          </div>
          <!-- <div class="index-task-item" @click="readState=true">
            <router-link to="/">
              <span class="unread-state-no"></span>所有服务商代理商按地区、服务商发布 服务商发步
              <span class="detail">详情</span>
            </router-link>
          </div>
          <div class="index-task-item" @click="readState=true">
            <router-link to="/">
              <span class="unread-state-no"></span>所有服务商代理商按地区、服务商发布 服务商发步
              <span class="detail">详情</span>
            </router-link>
          </div>-->
        </div>
        <!-- <jf-upload :disabledInput="QualificationInput" :fileList.sync="fileList"></jf-upload> -->
      </div>
    </div>
    <!-- 首页内容显示区域 -->

    <!-- <jf-upload-excel :fileList="fileList"></jf-upload-excel> -->

    <div class="index-footer">
      <p>
        <router-link to="/">帮助</router-link>
        <router-link to="/">隐私</router-link>
        <router-link to="/">条款</router-link>
      </p>
      <p>Copyright © 2012 - . All Rights Reserved 版权所有</p>
    </div>
  </div>
</template>


<style lang="scss" src="./index.scss" scoped></style>
<script src="./index.js" scoped></script>
