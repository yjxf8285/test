<template>
  <div>
    <container>
      <router-view/>
    </container>
  </div>
</template>

<script>
import Container from '_framework/layout/home.vue'

export default {
  name: 'index',
  components: { Container }
}
</script>
<style lang="scss">
  @import "../assets/css/index";
</style>
