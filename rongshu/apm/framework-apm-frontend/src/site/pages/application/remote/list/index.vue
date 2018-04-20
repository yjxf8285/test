<template>
  <div class="transaction">
    <FilterBarSimple ref="simplefilterbar" :contribution="true" @fbarChange="fbarChange"></FilterBarSimple>
    <div class="common-container">
      <div class="header-title">
        <i class="title-icon icon ion-stats-bars"></i>
        <span class="title-name">事务</span>
        <div class="seach-area fn-fr" style="padding:12px;">
          <au-input class="circular" v-model.trim="transName" placeholder="请输入内容"
                    ></au-input>
        </div>
      </div>
      <div class="content">
        <div class="table-wrap">
          <router-link :to="{name: 'transaction-detail'}">Go to Detail</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'remote-list'
}
</script>
