<template>
  <div class="header">
    <h2>{{ $route.name }}</h2>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/data-access">data-access</router-link></li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'header',
    data () {
      return {
        msg: '啊啊啊'
      }
    }
  }
</script>

