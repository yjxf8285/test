<style lang="scss" scoped>
  .top-bar {
    padding: 10px 16px;
  }
</style>

<template>
  <div class="application-list" style="height: 100%;">
    <div class="top-bar-container"><top-bar title="test / test / test"/></div>
    <router-link :to="{name: 'application'}">Go to Application</router-link>

  </div>
</template>

<script>
import TopBar from '_components/top-bar'
export default {
  name: 'application-list',
  components: { TopBar }
}
</script>
