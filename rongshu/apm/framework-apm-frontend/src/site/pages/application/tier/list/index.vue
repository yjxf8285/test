<template>
  <div class="tier-list">
    Tier List <br><br>
    <router-link :to="{name: 'tier-detail'}">Go to Tier Detail</router-link>
    <a href="javascript:;" @click="$router.back()">Backt</a>
  </div>
</template>
<script>
export default {
  name: 'tier-list'
}
</script>
