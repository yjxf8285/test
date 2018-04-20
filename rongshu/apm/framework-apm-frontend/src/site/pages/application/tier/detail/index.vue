<template>
  <div class="tier-detail">
    Tier Detail <br><br>
    <router-link :to="{name: 'transaction-list'}">Back to Tier List</router-link>
    <ul>
      <li><router-link :to="{name: 'tier-detail-dashboard'}">Tier Detail Dashboard</router-link></li>
      <li><router-link :to="{name: 'tier-detail-transaction'}">Tier Detail Transaction</router-link></li>
      <li><router-link :to="{name: 'tier-detail-database'}">Tier Detail Database</router-link></li>
      <li><router-link :to="{name: 'tier-detail-remote'}">Tier Detail Remote</router-link></li>
      <li><router-link :to="{name: 'tier-detail-error'}">Tier Detail Error</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'tier-detail',
  mounted () {
    // console.log(this.$route)
  }
}
</script>
