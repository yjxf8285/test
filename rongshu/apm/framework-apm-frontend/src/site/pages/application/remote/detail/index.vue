<template>
  <div class="remote-detail">
    Remote Detail <br><br>
    <a href="javascript:;" @click="$router.back({query: {c: 3, d: 4}})">Back to Remote List</a>
  </div>
</template>
<script>
export default {
  name: 'remote-detail'
}
</script>
