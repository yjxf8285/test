<template>
  <div id="app">
    <app-header></app-header>
    <app-leftmenu></app-leftmenu>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>


<script>
  export default {
    name: 'app',
    components: {
      'app-header': require('./components/header.vue'),
      'app-leftmenu': require('./components/leftmenu.vue'),
      'app-footer': require('./components/footer.vue')
    }
  }
</script>

