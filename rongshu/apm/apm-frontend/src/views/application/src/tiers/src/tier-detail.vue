<style lang="scss" scoped>

</style>
<template>
  <div class="tier-detail">
    <!-- <top-bar @barChange="barChange"></top-bar> -->
     <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'tier-detail',
  mounted() {},
  methods: {
    barChange(v) {}
  }
}
</script>
