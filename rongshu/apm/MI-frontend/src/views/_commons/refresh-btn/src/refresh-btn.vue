<style lang="scss" scoped>
  .refresh-btn {}
</style>
<template>
  <au-button class="refresh-btn" type="primary" @click="refresh">
    <au-icon type="refresh" />
  </au-button>
</template>
<script>
  import store from '_store'
  export default {
    name: 'refresh-btn',
    methods: {
      refresh () {
        store.$emit('refresh')
      }
    }
  }
</script>



