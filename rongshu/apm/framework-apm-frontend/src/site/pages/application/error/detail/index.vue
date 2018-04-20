<template>
  <div class="error-detail">
    Transaction Detail <br><br>
    <a href="javascript:;" @click="$router.back({query: {c: 3, d: 4}})">Back to Transaction List</a>
  </div>
</template>
<script>
export default {
  name: 'error-detail'
}
</script>
